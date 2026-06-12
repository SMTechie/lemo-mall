import "server-only";

import { Resend } from "resend";
import type { Order, OrderItem, Ticket } from "@prisma/client";
import { absoluteUrl, formatMoney } from "@/lib/utils";

const resendFrom = process.env.RESEND_FROM ?? "Lemo Mall <onboarding@resend.dev>";

function resendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendOrderConfirmation(
  order: Order & { items: OrderItem[]; tickets: Ticket[] }
) {
  const resend = resendClient();
  if (!resend) return;

  const lines = order.items
    .map((item) => `${item.quantity} x ${item.name} - ${formatMoney(item.totalPriceCents)}`)
    .join("<br />");

  const ticketLinks = order.tickets
    .map((ticket) => `<a href="${absoluteUrl(`/tickets/${ticket.code}`)}">${ticket.code}</a>`)
    .join("<br />");

  await resend.emails.send({
    from: resendFrom,
    to: order.customerEmail,
    subject: `Order ${order.orderNumber} confirmed`,
    html: `<h1>Thanks, ${order.customerName}</h1><p>Your payment is confirmed.</p><p>${lines}</p><p>${ticketLinks}</p>`
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const resend = resendClient();
  if (!resend) return false;

  await resend.emails.send({
    from: resendFrom,
    to: email,
    subject: "Reset your Lemo Mall password",
    html: `<h1>Password reset</h1><p>Use this secure link to reset your password. It expires in 1 hour.</p><p><a href="${resetUrl}">Reset password</a></p>`
  });

  return true;
}
