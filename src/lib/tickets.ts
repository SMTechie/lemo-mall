import crypto from "node:crypto";
import { TicketStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createQrDataUrl, createTicketQrPayload, getAppUrl, parseTicketCodeFromQrValue } from "@/lib/qr";
import { sendTicketEmail } from "@/lib/mail";
import {
  consumeDemoTicket,
  finalizeDemoOrder,
  getDemoTicketByCode,
} from "@/lib/demo-store";

function createTicketCode(orderNumber: string, index: number) {
  const suffix = crypto.randomUUID().split("-")[0].slice(0, 6).toUpperCase();
  return `${orderNumber}-${String(index + 1).padStart(2, "0")}-${suffix}`;
}

export async function finalizePaidOrder(orderNumber: string, extras?: {
  paygateRequestId?: string;
  paygateTransactionId?: string;
  paygateResultCode?: string;
  paygateResultDesc?: string;
}) {
  if (!process.env.DATABASE_URL) {
    const demoOrder = finalizeDemoOrder(orderNumber, extras);

    if (demoOrder.tickets.length > 0) {
      const ticketEmailTickets = await Promise.all(
        demoOrder.tickets.map(async (ticket) => ({
          code: ticket.code,
          eventTitle: ticket.event.title,
          ticketUrl: ticket.ticketUrl,
          qrDataUrl: await createQrDataUrl(ticket.qrPayload),
        })),
      );

      await sendTicketEmail({
        to: demoOrder.customerEmail,
        customerName: demoOrder.customerName,
        orderNumber: demoOrder.orderNumber,
        tickets: ticketEmailTickets,
      });
    }

    return demoOrder;
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      tickets: {
        include: {
          event: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status === "PAID" && order.tickets.length > 0) {
    return order;
  }

  const updatedOrder = await prisma.order.update({
    where: { orderNumber },
    data: {
      status: "PAID",
      paidAt: new Date(),
      paygateRequestId: extras?.paygateRequestId ?? order.paygateRequestId,
      paygateTransactionId: extras?.paygateTransactionId ?? order.paygateTransactionId,
      paygateResultCode: extras?.paygateResultCode ?? order.paygateResultCode,
      paygateResultDesc: extras?.paygateResultDesc ?? order.paygateResultDesc,
    },
  });

  const ticketItems = order.items.filter((item) => item.type === "TICKET");
  const existingTickets = await prisma.ticket.count({
    where: { orderId: order.id },
  });

  if (ticketItems.length > 0 && existingTickets === 0) {
    const ticketsToCreate = ticketItems.flatMap((item) =>
      Array.from({ length: item.quantity }).map((_, index) => {
        const eventId =
          item.eventId ?? order.items.find((orderItem) => orderItem.eventId)?.eventId;

        if (!eventId) {
          throw new Error("Unable to determine event for ticket generation");
        }

        const code = createTicketCode(order.orderNumber, index);
        return {
          code,
          qrPayload: createTicketQrPayload(code),
          status: TicketStatus.VALID,
          eventId,
          userId: order.userId ?? null,
          orderId: order.id,
          holderName: order.customerName,
          holderEmail: order.customerEmail,
        };
      }),
    );

    await prisma.ticket.createMany({
      data: ticketsToCreate,
    });
  }

  const tickets = await prisma.ticket.findMany({
    where: { orderId: order.id },
    include: {
      event: true,
    },
  });

  if (tickets.length > 0) {
    const ticketEmailTickets = await Promise.all(
      tickets.map(async (ticket) => ({
        code: ticket.code,
        eventTitle: ticket.event.title,
        ticketUrl: `${getAppUrl()}/tickets/${ticket.code}`,
        qrDataUrl: await createQrDataUrl(ticket.qrPayload),
      })),
    );

    await sendTicketEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      tickets: ticketEmailTickets,
    });
  }

  return updatedOrder;
}

export async function verifyAndConsumeTicket(input: {
  code: string;
  scannerUserId?: string;
}) {
  if (!process.env.DATABASE_URL) {
    const code = parseTicketCodeFromQrValue(input.code);
    const ticket = getDemoTicketByCode(code);

    if (!ticket) {
      return {
        valid: false,
        status: "NOT_FOUND",
        message: "Ticket not found",
        ticket: null,
      } as const;
    }

    if (ticket.status === TicketStatus.USED) {
      return {
        valid: false,
        status: "USED",
        message: "Ticket already used",
        ticket,
      } as const;
    }

    if (ticket.status === TicketStatus.VOID) {
      return {
        valid: false,
        status: "VOID",
        message: "Ticket has been voided",
        ticket,
      } as const;
    }

    const updated = consumeDemoTicket(code, input.scannerUserId);

    return {
      valid: true,
      status: "VALID",
      message: "Ticket marked as used",
      ticket: updated,
    } as const;
  }

  const code = parseTicketCodeFromQrValue(input.code);
  const ticket = await prisma.ticket.findUnique({
    where: { code },
    include: {
      event: true,
      order: true,
      user: true,
    },
  });

  if (!ticket) {
    return {
      valid: false,
      status: "NOT_FOUND",
      message: "Ticket not found",
      ticket: null,
    } as const;
  }

  if (ticket.status === TicketStatus.USED) {
    return {
      valid: false,
      status: "USED",
      message: "Ticket already used",
      ticket,
    } as const;
  }

  if (ticket.status === TicketStatus.VOID) {
    return {
      valid: false,
      status: "VOID",
      message: "Ticket has been voided",
      ticket,
    } as const;
  }

  const updated = await prisma.ticket.update({
    where: { code },
    data: {
      status: TicketStatus.USED,
      usedAt: new Date(),
      checkedInById: input.scannerUserId ?? null,
    },
    include: {
      event: true,
      order: true,
      user: true,
    },
  });

  return {
    valid: true,
    status: "VALID",
    message: "Ticket marked as used",
    ticket: updated,
  } as const;
}

export type VerifiedTicketResult = Awaited<ReturnType<typeof verifyAndConsumeTicket>>;

export async function getTicketByCode(code: string) {
  if (!process.env.DATABASE_URL) {
    const ticket = getDemoTicketByCode(code);

    if (!ticket) {
      return null;
    }

    return ticket;
  }

  const ticket = await prisma.ticket.findUnique({
    where: { code },
    include: {
      event: true,
      order: true,
      user: true,
      checkedInBy: true,
    },
  });

  if (!ticket) {
    return null;
  }

  return {
    ...ticket,
    ticketUrl: `${getAppUrl()}/tickets/${ticket.code}`,
  };
}
