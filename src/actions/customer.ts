"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { refundSchema, reviewSchema } from "@/lib/validators";

export async function toggleWishlistAction(formData: FormData) {
  const session = await requireUser();
  const productId = String(formData.get("productId") || "");
  const eventId = String(formData.get("eventId") || "");

  const existing = await prisma.wishlistItem.findFirst({
    where: {
      userId: session.user.id,
      productId: productId || undefined,
      eventId: eventId || undefined
    }
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId: productId || undefined,
        eventId: eventId || undefined
      }
    });
  }

  revalidatePath("/account/wishlist");
}

export async function createReviewAction(formData: FormData) {
  const session = await requireUser();
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Invalid review");

  await prisma.review.create({
    data: {
      userId: session.user.id,
      productId: parsed.data.productId,
      eventId: parsed.data.eventId,
      rating: parsed.data.rating,
      comment: parsed.data.comment
    }
  });

  if (parsed.data.productId) revalidatePath("/shop");
  if (parsed.data.eventId) revalidatePath("/events");
}

export async function createRefundRequestAction(formData: FormData) {
  const session = await requireUser();
  const parsed = refundSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Invalid refund request");

  const order = await prisma.order.findFirst({
    where: { id: parsed.data.orderId, userId: session.user.id }
  });
  if (!order) throw new Error("Order not found");

  await prisma.refundRequest.create({
    data: {
      orderId: order.id,
      userId: session.user.id,
      reason: parsed.data.reason,
      amountCents: order.totalCents
    }
  });

  revalidatePath("/account/orders");
  redirect("/account/orders");
}

export async function transferTicketAction(formData: FormData) {
  const session = await requireUser();
  const ticketId = String(formData.get("ticketId"));
  const email = String(formData.get("email")).toLowerCase();
  const name = String(formData.get("name") || "");

  const ticket = await prisma.ticket.findFirst({
    where: { id: ticketId, userId: session.user.id, status: "VALID" }
  });
  if (!ticket) throw new Error("Ticket cannot be transferred");

  const recipient = await prisma.user.findUnique({ where: { email } });
  await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      userId: recipient?.id,
      holderEmail: email,
      holderName: name || recipient?.name || email,
      transferredAt: new Date()
    }
  });

  revalidatePath(`/tickets/${ticket.code}`);
  redirect(`/tickets/${ticket.code}`);
}
