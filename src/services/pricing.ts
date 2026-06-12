import "server-only";

import type { TicketType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function effectiveTicketPrice(ticketType: TicketType) {
  const now = new Date();
  const rules = await prisma.pricingRule.findMany({
    where: {
      active: true,
      OR: [{ ticketTypeId: ticketType.id }, { eventId: ticketType.eventId }],
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] }
      ]
    },
    orderBy: { createdAt: "desc" }
  });

  let price = ticketType.priceCents;
  for (const rule of rules) {
    if (rule.type === "INVENTORY_TIER" && rule.threshold != null) {
      const remaining = ticketType.quantity - ticketType.sold;
      if (remaining > rule.threshold) continue;
    }

    if (rule.priceCents != null) price = rule.priceCents;
    if (rule.discountBps != null) price = Math.max(0, Math.floor(price * (1 - rule.discountBps / 10000)));
  }

  return price;
}

export function platformFee(totalCents: number, feeBps = 250, fixedTicketFeeCents = 0, ticketQuantity = 0) {
  return Math.floor((totalCents * feeBps) / 10000) + fixedTicketFeeCents * ticketQuantity;
}
