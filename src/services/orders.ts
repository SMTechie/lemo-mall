import "server-only";

import { type OrderItem } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendOrderConfirmation } from "@/lib/mail";
import { ticketCreateData } from "@/services/tickets";

export async function markOrderPaid(orderId: string, paymentIntentId?: string) {
  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true, tickets: true }
    });

    if (!existing) throw new Error("Order not found");
    if (existing.status !== "PENDING") return { order: existing, shouldSendConfirmation: false };

    const createdTickets = [];
    for (const item of existing.items.filter((entry) => entry.type === "TICKET")) {
      for (let index = 0; index < item.quantity; index++) {
        if (!item.eventId || !item.ticketTypeId) throw new Error("Ticket order item is incomplete");
        createdTickets.push(await ticketCreateData(tx, {
          userId: existing.userId,
          eventId: item.eventId,
          ticketTypeId: item.ticketTypeId,
          orderId: existing.id,
          holderName: existing.customerName,
          holderEmail: existing.customerEmail
        }));
      }
    }

    if (createdTickets.length) {
      await tx.ticket.createMany({ data: createdTickets });
    }

    if (existing.discountCodeId) {
      await tx.discountCode.update({
        where: { id: existing.discountCodeId },
        data: { usedCount: { increment: 1 } }
      });
    }

    const firstInstallment = await tx.paymentInstallment.findFirst({
      where: { orderId: existing.id, sequence: 1 }
    });

    if (firstInstallment) {
      await tx.paymentInstallment.update({
        where: { id: firstInstallment.id },
        data: { status: "PAID", paidAt: new Date(), stripePaymentIntentId: paymentIntentId }
      });
    }

    if (existing.userId) {
      const points = Math.floor(existing.totalCents / 1000);
      await tx.user.update({
        where: { id: existing.userId },
        data: {
          loyaltyPoints: { increment: points },
          tags: existing.totalCents >= 500000 ? { push: "VIP" } : undefined
        }
      });
      await tx.loyaltyTransaction.create({
        data: {
          userId: existing.userId,
          orderId: existing.id,
          points,
          reason: "Purchase reward"
        }
      });
    }

    const order = await tx.order.update({
      where: { id: existing.id },
      data: {
        status: existing.balanceDueCents > 0 ? "PARTIALLY_PAID" : "PAID",
        amountPaidCents: existing.paymentMode === "DEPOSIT" ? existing.totalCents - existing.balanceDueCents : existing.totalCents,
        paidAt: new Date(),
        stripePaymentIntentId: paymentIntentId
      },
      include: { items: true, tickets: true }
    });

    return { order, shouldSendConfirmation: true };
  });

  if (result.shouldSendConfirmation) await sendOrderConfirmation(result.order);
  return result.order;
}

export async function syncPaidOrderFromStripe(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, stripeCheckoutId: true }
  });

  if (!order?.stripeCheckoutId || order.status !== "PENDING") return;

  const checkoutSession = await stripe.checkout.sessions.retrieve(order.stripeCheckoutId);
  if (checkoutSession.payment_status !== "paid") return;

  await markOrderPaid(order.id, checkoutSession.payment_intent?.toString());
}

export async function releaseReservedInventory(orderId: string) {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order || order.status !== "PENDING") return;

    for (const item of order.items as OrderItem[]) {
      if (item.type === "PRODUCT" && item.productId) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        });
      }

      if (item.type === "TICKET" && item.ticketTypeId) {
        await tx.ticketType.update({
          where: { id: item.ticketTypeId },
          data: { sold: { decrement: item.quantity } }
        });
      }
    }

    await tx.order.update({
      where: { id: order.id },
      data: { status: "FAILED" }
    });
  });
}

export async function adminMetrics() {
  const [orders, ticketsSold, productItems, users] = await Promise.all([
    prisma.order.findMany({ where: { status: "PAID" }, select: { totalCents: true, createdAt: true } }),
    prisma.ticket.count({ where: { order: { status: "PAID" } } }),
    prisma.orderItem.aggregate({
      where: { type: "PRODUCT", order: { status: "PAID" } },
      _sum: { quantity: true }
    }),
    prisma.user.count()
  ]);

  const revenue = orders.reduce((sum, order) => sum + order.totalCents, 0);
  const salesByDay = orders.reduce<Record<string, number>>((acc, order) => {
    const key = order.createdAt.toISOString().slice(0, 10);
    acc[key] = (acc[key] ?? 0) + order.totalCents / 100;
    return acc;
  }, {});

  return {
    revenue,
    ticketsSold,
    productsSold: productItems._sum.quantity ?? 0,
    users,
    sales: Object.entries(salesByDay).map(([date, total]) => ({ date, total }))
  };
}
