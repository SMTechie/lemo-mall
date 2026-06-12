import "server-only";

import { prisma } from "@/lib/prisma";

export async function createOperationalAlerts() {
  const [lowProducts, lowTickets] = await Promise.all([
    prisma.product.findMany({ where: { active: true, stock: { lte: 10 } }, take: 20 }),
    prisma.ticketType.findMany({ where: { active: true }, include: { event: true }, take: 100 })
  ]);

  for (const product of lowProducts) {
    await prisma.adminNotification.create({
      data: {
        tenantId: product.tenantId,
        type: "LOW_STOCK",
        title: "Low stock",
        message: `${product.name} has ${product.stock} units left.`
      }
    });
  }

  for (const ticket of lowTickets.filter((entry) => entry.quantity - entry.sold <= 20)) {
    await prisma.adminNotification.create({
      data: {
        tenantId: ticket.event.tenantId,
        type: "TICKETS_LOW",
        title: "Tickets almost sold out",
        message: `${ticket.event.title} - ${ticket.name} has ${ticket.quantity - ticket.sold} tickets left.`
      }
    });
  }
}

export async function sendWhatsAppMessage(to: string, message: string) {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return { skipped: true };

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message }
    })
  });

  return { ok: response.ok };
}
