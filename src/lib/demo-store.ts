import crypto from "node:crypto";
import { OrderStatus, OrderType, TicketStatus, type OrderItemType } from "@prisma/client";
import { createTicketQrPayload, getAppUrl } from "@/lib/qr";

type DemoEvent = {
  id: string;
  slug: string;
  title: string;
  location: string;
  startsAt: Date;
};

export type DemoOrderItem = {
  type: OrderItemType;
  name: string;
  quantity: number;
  unitPriceCents: number;
  totalPriceCents: number;
  event?: DemoEvent | null;
  productId?: string | null;
  eventId?: string | null;
};

export type DemoTicket = {
  id: string;
  code: string;
  qrPayload: string;
  status: TicketStatus;
  event: DemoEvent;
  order: {
    orderNumber: string;
    status: OrderStatus;
    customerName: string;
  };
  userId: string | null;
  holderName: string | null;
  holderEmail: string | null;
  checkedInById: string | null;
  usedAt: Date | null;
  notes: string | null;
  ticketUrl: string;
};

export type DemoOrder = {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  currency: string;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  paygateReference: string | null;
  paygateRequestId: string | null;
  paygateTransactionId: string | null;
  paygateResultCode: string | null;
  paygateResultDesc: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: unknown;
  notes: string | null;
  userId: string | null;
  discountCodeId: string | null;
  items: DemoOrderItem[];
  tickets: DemoTicket[];
  paidAt: Date | null;
  fulfilledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  mockPayment: boolean;
};

const orders = new Map<string, DemoOrder>();
const tickets = new Map<string, DemoTicket>();

function createTicketCode(orderNumber: string, index: number) {
  const suffix = crypto.randomUUID().split("-")[0].slice(0, 6).toUpperCase();
  return `${orderNumber}-${String(index + 1).padStart(2, "0")}-${suffix}`;
}

export function upsertDemoOrder(order: DemoOrder) {
  orders.set(order.orderNumber, order);
  for (const ticket of order.tickets) {
    tickets.set(ticket.code, ticket);
  }
  return order;
}

export function getDemoOrder(orderNumber: string) {
  return orders.get(orderNumber) ?? null;
}

export function getDemoTicketByCode(code: string) {
  return tickets.get(code) ?? null;
}

export function listDemoOrders() {
  return Array.from(orders.values()).sort(
    (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
  );
}

export function listDemoTickets() {
  return Array.from(tickets.values()).sort((left, right) => left.code.localeCompare(right.code));
}

export function finalizeDemoOrder(
  orderNumber: string,
  extras?: {
    paygateRequestId?: string;
    paygateTransactionId?: string;
    paygateResultCode?: string;
    paygateResultDesc?: string;
  },
) {
  const order = orders.get(orderNumber);

  if (!order) {
    throw new Error("Order not found");
  }

  const updatedAt = new Date();
  const alreadyPaid = order.status === OrderStatus.PAID && order.tickets.length > 0;

  if (!alreadyPaid) {
    order.status = OrderStatus.PAID;
    order.paidAt = new Date();
    order.paygateRequestId = extras?.paygateRequestId ?? order.paygateRequestId;
    order.paygateTransactionId = extras?.paygateTransactionId ?? order.paygateTransactionId;
    order.paygateResultCode = extras?.paygateResultCode ?? order.paygateResultCode;
    order.paygateResultDesc = extras?.paygateResultDesc ?? order.paygateResultDesc;

    const ticketItems = order.items.filter((item) => item.type === "TICKET");

    if (ticketItems.length > 0 && order.tickets.length === 0) {
      const newTickets = ticketItems.flatMap((item) => {
        if (!item.event) {
          throw new Error("Unable to determine event for ticket generation");
        }

        return Array.from({ length: item.quantity }).map((_, index) => {
          const code = createTicketCode(order.orderNumber, index);
          const ticket: DemoTicket = {
            id: code,
            code,
            qrPayload: createTicketQrPayload(code),
            status: TicketStatus.VALID,
            event: item.event!,
            order: {
              orderNumber: order.orderNumber,
              status: order.status,
              customerName: order.customerName,
            },
            userId: order.userId,
            holderName: order.customerName,
            holderEmail: order.customerEmail,
            checkedInById: null,
            usedAt: null,
            notes: null,
            ticketUrl: `${getAppUrl()}/tickets/${code}`,
          };
          tickets.set(code, ticket);
          return ticket;
        });
      });

      order.tickets.push(...newTickets);
    }
  }

  order.updatedAt = updatedAt;
  orders.set(orderNumber, order);
  return order;
}

export function consumeDemoTicket(code: string, scannerUserId?: string) {
  const ticket = tickets.get(code);

  if (!ticket) {
    return null;
  }

  if (ticket.status === TicketStatus.USED) {
    return ticket;
  }

  ticket.status = TicketStatus.USED;
  ticket.usedAt = new Date();
  ticket.checkedInById = scannerUserId ?? null;
  tickets.set(code, ticket);

  const order = orders.get(ticket.order.orderNumber);
  if (order) {
    order.tickets = order.tickets.map((entry) =>
      entry.code === code ? ticket : entry,
    );
    orders.set(order.orderNumber, order);
  }

  return ticket;
}
