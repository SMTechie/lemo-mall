"use server";

import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createYocoCheckout } from "@/lib/yoco";
import { orderNumber } from "@/lib/utils";
import { checkoutSchema } from "@/lib/validators";
import { platformFee } from "@/services/pricing";

type CheckoutState = { error?: string; url?: string };

export async function createCheckoutAction(_: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const rawItems = JSON.parse(String(formData.get("items") ?? "[]"));
  const parsed = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    discountCode: formData.get("discountCode") || undefined,
    items: rawItems
  });

  if (!parsed.success) return { error: "Your checkout details are incomplete." };

  const session = await auth();
  const { customerName, customerEmail, items, discountCode } = parsed.data;
  const paymentMode = formData.get("paymentMode") === "DEPOSIT" ? "DEPOSIT" : "FULL";

  try {
    const result = await prisma.$transaction(async (tx) => {
      const productIds = items.filter((item) => item.kind === "product").map((item) => item.productId);
      const ticketTypeIds = items.filter((item) => item.kind === "ticket").map((item) => item.ticketTypeId);

      const [products, ticketTypes, discount, tenant] = await Promise.all([
        tx.product.findMany({ where: { id: { in: productIds }, active: true } }),
        tx.ticketType.findMany({
          where: { id: { in: ticketTypeIds }, active: true },
          include: { event: true, pricingRules: { where: { active: true } } }
        }),
        discountCode
          ? tx.discountCode.findUnique({ where: { code: discountCode.toUpperCase() } })
          : Promise.resolve(null),
        tx.tenant.findFirst({ where: { active: true }, orderBy: { createdAt: "asc" } })
      ]);

      const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];

      for (const item of items) {
        if (item.kind === "product") {
          const product = products.find((entry) => entry.id === item.productId);
          if (!product) throw new Error("Product unavailable");
          const reserved = await tx.product.updateMany({
            where: { id: product.id, stock: { gte: item.quantity }, active: true },
            data: { stock: { decrement: item.quantity } }
          });
          if (reserved.count !== 1) throw new Error(`${product.name} is out of stock`);
          orderItems.push({
            type: "PRODUCT",
            name: product.name,
            quantity: item.quantity,
            unitPriceCents: product.priceCents,
            totalPriceCents: product.priceCents * item.quantity,
            product: { connect: { id: product.id } }
          });
        } else {
          const ticketType = ticketTypes.find((entry) => entry.id === item.ticketTypeId);
          if (!ticketType) throw new Error("Ticket unavailable");
          const reserved = await tx.$executeRaw`
            UPDATE "TicketType"
            SET "sold" = "sold" + ${item.quantity}, "updatedAt" = now()
            WHERE "id" = ${ticketType.id} AND ("sold" + ${item.quantity}) <= "quantity" AND "active" = true
          `;
          if (reserved !== 1) throw new Error(`${ticketType.name} tickets are sold out`);
          let unitPriceCents = ticketType.priceCents;
          const now = new Date();
          for (const rule of ticketType.pricingRules) {
            if (rule.startsAt && rule.startsAt > now) continue;
            if (rule.endsAt && rule.endsAt < now) continue;
            if (rule.type === "INVENTORY_TIER" && rule.threshold != null && ticketType.quantity - ticketType.sold > rule.threshold) continue;
            if (rule.priceCents != null) unitPriceCents = rule.priceCents;
            if (rule.discountBps != null) unitPriceCents = Math.max(0, Math.floor(unitPriceCents * (1 - rule.discountBps / 10000)));
          }
          orderItems.push({
            type: "TICKET",
            name: `${ticketType.event.title} - ${ticketType.name}`,
            quantity: item.quantity,
            unitPriceCents,
            totalPriceCents: unitPriceCents * item.quantity,
            event: { connect: { id: ticketType.eventId } },
            ticketType: { connect: { id: ticketType.id } }
          });
        }
      }

      const subtotalCents = orderItems.reduce((sum, item) => sum + Number(item.totalPriceCents), 0);
      const validDiscount =
        discount &&
        discount.active &&
        (!discount.expiresAt || discount.expiresAt > new Date()) &&
        (!discount.usageLimit || discount.usedCount < discount.usageLimit);
      const discountCents = validDiscount
        ? discount.type === "PERCENTAGE"
          ? Math.floor((subtotalCents * discount.value) / 100)
          : Math.min(discount.value, subtotalCents)
        : 0;
      const ticketQuantity = items.filter((item) => item.kind === "ticket").reduce((sum, item) => sum + item.quantity, 0);
      const platformFeeCents = platformFee(subtotalCents, tenant?.platformFeeBps, tenant?.fixedTicketFeeCents, ticketQuantity);
      const totalCents = Math.max(0, subtotalCents - discountCents + platformFeeCents);
      if (totalCents < 200) throw new Error("Yoco payments must be at least R2.00.");
      const amountDueNowCents = paymentMode === "DEPOSIT" ? Math.max(200, Math.ceil(totalCents * 0.5)) : Math.max(200, totalCents);
      const balanceDueCents = totalCents - amountDueNowCents;

      const order = await tx.order.create({
        data: {
          tenantId: tenant?.id,
          orderNumber: orderNumber(),
          paymentMode,
          customerName,
          customerEmail,
          userId: session?.user?.id,
          subtotalCents,
          discountCents,
          platformFeeCents,
          totalCents,
          balanceDueCents,
          discountCodeId: validDiscount ? discount.id : undefined,
          items: { create: orderItems },
          installments:
            paymentMode === "DEPOSIT"
              ? {
                  create: [
                    { sequence: 1, amountCents: amountDueNowCents, status: "PENDING" },
                    { sequence: 2, amountCents: balanceDueCents, status: "PENDING" }
                  ]
                }
              : undefined
        },
        include: { items: true }
      });

      const yocoCheckout = await createYocoCheckout({
        orderId: order.id,
        orderNumber: order.orderNumber,
        amountCents: amountDueNowCents,
        description: paymentMode === "DEPOSIT" ? `Deposit for ${order.orderNumber}` : `Order ${order.orderNumber}`
      });

      await tx.order.update({
        where: { id: order.id },
        data: { yocoCheckoutId: yocoCheckout.id }
      });

      return { url: yocoCheckout.redirectUrl };
    });

    return { url: result.url ?? undefined };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to create checkout." };
  }
}
