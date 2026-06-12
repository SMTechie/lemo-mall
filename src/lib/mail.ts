import "server-only";

import nodemailer from "nodemailer";
import type { Order, OrderItem, Ticket } from "@prisma/client";
import { absoluteUrl, formatMoney } from "@/lib/utils";

function transporter() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined
  });
}

export async function sendOrderConfirmation(
  order: Order & { items: OrderItem[]; tickets: Ticket[] }
) {
  const tx = transporter();
  if (!tx) return;

  const lines = order.items
    .map((item) => `${item.quantity} x ${item.name} - ${formatMoney(item.totalPriceCents)}`)
    .join("<br />");

  const ticketLinks = order.tickets
    .map((ticket) => `<a href="${absoluteUrl(`/tickets/${ticket.code}`)}">${ticket.code}</a>`)
    .join("<br />");

  await tx.sendMail({
    from: process.env.SMTP_FROM ?? "Lemo Mall <orders@localhost>",
    to: order.customerEmail,
    subject: `Order ${order.orderNumber} confirmed`,
    html: `<h1>Thanks, ${order.customerName}</h1><p>Your payment is confirmed.</p><p>${lines}</p><p>${ticketLinks}</p>`
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const tx = transporter();
  if (!tx) return false;

  await tx.sendMail({
    from: process.env.SMTP_FROM ?? "Lemo Mall <orders@localhost>",
    to: email,
    subject: "Reset your Lemo Mall password",
    html: `<h1>Password reset</h1><p>Use this secure link to reset your password. It expires in 1 hour.</p><p><a href="${resetUrl}">Reset password</a></p>`
  });

  return true;
}
