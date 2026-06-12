import "server-only";

import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { ticketPayload, ticketQrDataUrl } from "@/lib/qr";

type TicketRecord = {
  code: string;
  status: string;
  holderName: string | null;
  holderEmail?: string | null;
  usedAt?: Date | string | null;
  event: {
    title: string;
    startsAt?: Date | string;
    location?: string;
  };
  ticketType: {
    name: string;
  };
};

function ticketCode() {
  return `TKT-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
}

export async function uniqueTicketCode(tx: Prisma.TransactionClient) {
  for (let attempts = 0; attempts < 8; attempts++) {
    const code = ticketCode();
    const existing = await tx.ticket.findUnique({ where: { code }, select: { id: true } });
    if (!existing) return code;
  }

  throw new Error("Could not create a unique ticket code.");
}

export async function ticketCreateData(tx: Prisma.TransactionClient, input: {
  userId?: string | null;
  eventId: string;
  ticketTypeId: string;
  orderId: string;
  holderName: string;
  holderEmail: string;
}) {
  const code = await uniqueTicketCode(tx);
  return {
    code,
    qrPayload: ticketPayload(code),
    qrImage: await ticketQrDataUrl(code),
    userId: input.userId,
    eventId: input.eventId,
    ticketTypeId: input.ticketTypeId,
    orderId: input.orderId,
    holderName: input.holderName,
    holderEmail: input.holderEmail
  };
}

export function publicTicket(ticket: TicketRecord) {
  return {
    code: ticket.code,
    status: ticket.status,
    holderName: ticket.holderName,
    holderEmail: ticket.holderEmail,
    event: {
      title: ticket.event.title,
      startsAt: ticket.event.startsAt instanceof Date ? ticket.event.startsAt.toISOString() : ticket.event.startsAt,
      location: ticket.event.location
    },
    ticketType: {
      name: ticket.ticketType.name
    },
    usedAt: ticket.usedAt instanceof Date ? ticket.usedAt.toISOString() : ticket.usedAt
  };
}
