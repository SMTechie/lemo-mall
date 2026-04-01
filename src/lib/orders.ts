import { OrderItemType, OrderStatus, OrderType, type DiscountCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { demoDiscountCodes, demoEvents, demoProducts } from "@/lib/demo-data";
import {
  getDemoOrder,
  upsertDemoOrder,
  type DemoOrderItem,
} from "@/lib/demo-store";
import { createOrderNumber } from "@/lib/utils";
import { hasPayGateCredentials, initiatePayGateTransaction } from "@/lib/paygate";
import { getAppUrl } from "@/lib/qr";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators";

type ResolvedCheckoutItem = {
  type: OrderItemType;
  name: string;
  quantity: number;
  unitPriceCents: number;
  totalPriceCents: number;
  eventId?: string;
  productId?: string;
};

type CreateCheckoutOrderInput = CheckoutInput & {
  userId?: string | null;
};

async function resolveDiscountCode(code?: string) {
  if (!code) {
    return null;
  }

  const discount = await prisma.discountCode.findUnique({
    where: { code },
  });

  if (!discount || !discount.active) {
    throw new Error("Discount code is invalid or inactive");
  }

  if (discount.expiresAt && discount.expiresAt < new Date()) {
    throw new Error("Discount code has expired");
  }

  if (typeof discount.usageLimit === "number" && discount.usedCount >= discount.usageLimit) {
    throw new Error("Discount code usage limit reached");
  }

  return discount;
}

function calculateDiscount(subtotalCents: number, discount: DiscountCode | null) {
  if (!discount) {
    return 0;
  }

  if (discount.type === "PERCENTAGE") {
    return Math.floor((subtotalCents * discount.value) / 100);
  }

  return Math.min(discount.value, subtotalCents);
}

async function resolveCartItems(items: CheckoutInput["items"]) {
  const resolved: ResolvedCheckoutItem[] = [];

  for (const item of items) {
    if (item.kind === "TICKET") {
      const event = await prisma.event.findUnique({
        where: { id: item.id },
      });

      if (!event) {
        throw new Error(`Event ${item.name} could not be found`);
      }

      resolved.push({
        type: OrderItemType.TICKET,
        name: event.title,
        quantity: item.quantity,
        unitPriceCents: event.ticketPriceCents,
        totalPriceCents: event.ticketPriceCents * item.quantity,
        eventId: event.id,
      });
      continue;
    }

    const product = await prisma.product.findUnique({
      where: { id: item.id },
    });

    if (!product) {
      throw new Error(`Product ${item.name} could not be found`);
    }

    resolved.push({
      type: OrderItemType.PRODUCT,
      name: product.name,
      quantity: item.quantity,
      unitPriceCents: product.priceCents,
      totalPriceCents: product.priceCents * item.quantity,
      productId: product.id,
    });
  }

  return resolved;
}

function resolveDemoCartItems(items: CheckoutInput["items"]) {
  const resolved: DemoOrderItem[] = [];

  for (const item of items) {
    if (item.kind === "TICKET") {
      const event = demoEvents.find((entry) => entry.slug === item.id);

      if (!event) {
        throw new Error(`Event ${item.name} could not be found`);
      }

      resolved.push({
        type: OrderItemType.TICKET,
        name: event.title,
        quantity: item.quantity,
        unitPriceCents: event.ticketPriceCents,
        totalPriceCents: event.ticketPriceCents * item.quantity,
        event: {
          id: event.slug,
          slug: event.slug,
          title: event.title,
          location: event.location,
          startsAt: new Date(event.startsAt),
        },
        eventId: event.slug,
      });
      continue;
    }

    const product = demoProducts.find((entry) => entry.slug === item.id);

    if (!product) {
      throw new Error(`Product ${item.name} could not be found`);
    }

    resolved.push({
      type: OrderItemType.PRODUCT,
      name: product.name,
      quantity: item.quantity,
      unitPriceCents: product.priceCents,
      totalPriceCents: product.priceCents * item.quantity,
      productId: product.slug,
    });
  }

  return resolved;
}

export async function createCheckoutOrder(input: CreateCheckoutOrderInput) {
  const parsed = checkoutSchema.parse(input);
  const orderNumber = createOrderNumber();

  if (!process.env.DATABASE_URL) {
    const resolvedItems = resolveDemoCartItems(parsed.items);
    const subtotalCents = resolvedItems.reduce((sum, item) => sum + item.totalPriceCents, 0);
    const discount = parsed.discountCode
      ? demoDiscountCodes.find((entry) => entry.code === parsed.discountCode)
      : null;
    const discountCents = calculateDiscount(subtotalCents, discount as DiscountCode | null);
    const totalCents = Math.max(subtotalCents - discountCents, 0);
    const type =
      resolvedItems.some((item) => item.type === OrderItemType.TICKET) &&
      resolvedItems.some((item) => item.type === OrderItemType.PRODUCT)
        ? OrderType.MIXED
        : resolvedItems.some((item) => item.type === OrderItemType.TICKET)
          ? OrderType.TICKET
          : OrderType.PRODUCT;

    upsertDemoOrder({
      id: orderNumber,
      orderNumber,
      type,
      status: OrderStatus.AWAITING_PAYMENT,
      currency: "ZAR",
      subtotalCents,
      discountCents,
      totalCents,
      paygateReference: orderNumber,
      paygateRequestId: null,
      paygateTransactionId: null,
      paygateResultCode: null,
      paygateResultDesc: null,
      customerName: parsed.customerName,
      customerEmail: parsed.customerEmail,
      customerPhone: parsed.customerPhone ?? null,
      shippingAddress: {
        line1: parsed.shippingAddressLine1,
        line2: parsed.shippingAddressLine2,
        city: parsed.shippingCity,
        region: parsed.shippingRegion,
        postalCode: parsed.shippingPostalCode,
        country: parsed.shippingCountry,
      },
      notes: parsed.notes ?? null,
      userId: input.userId ?? null,
      discountCodeId: parsed.discountCode ?? null,
      items: resolvedItems,
      tickets: [],
      paidAt: null,
      fulfilledAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      mockPayment: true,
    });

    return {
      orderNumber,
      paygateRequestId: null,
      mockPayment: true,
    };
  }

  const resolvedItems = await resolveCartItems(parsed.items);
  const subtotalCents = resolvedItems.reduce(
    (sum, item) => sum + item.totalPriceCents,
    0,
  );
  const discount = await resolveDiscountCode(parsed.discountCode);
  const discountCents = calculateDiscount(subtotalCents, discount);
  const totalCents = Math.max(subtotalCents - discountCents, 0);
  const type =
    resolvedItems.some((item) => item.type === OrderItemType.TICKET) &&
    resolvedItems.some((item) => item.type === OrderItemType.PRODUCT)
      ? OrderType.MIXED
      : resolvedItems.some((item) => item.type === OrderItemType.TICKET)
        ? OrderType.TICKET
        : OrderType.PRODUCT;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      type,
      status: OrderStatus.AWAITING_PAYMENT,
      currency: "ZAR",
      subtotalCents,
      discountCents,
      totalCents,
      customerName: parsed.customerName,
      customerEmail: parsed.customerEmail,
      customerPhone: parsed.customerPhone ?? null,
      notes: parsed.notes ?? null,
      userId: input.userId ?? null,
      discountCodeId: discount?.id,
      shippingAddress: {
        line1: parsed.shippingAddressLine1,
        line2: parsed.shippingAddressLine2,
        city: parsed.shippingCity,
        region: parsed.shippingRegion,
        postalCode: parsed.shippingPostalCode,
        country: parsed.shippingCountry,
      },
      items: {
        create: resolvedItems.map((item) => ({
          type: item.type,
          name: item.name,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
          totalPriceCents: item.totalPriceCents,
          eventId: item.eventId,
          productId: item.productId,
        })),
      },
      paygateReference: orderNumber,
    },
    include: {
      items: true,
    },
  });

  if (discount) {
    await prisma.discountCode.update({
      where: { id: discount.id },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });
  }

  let paygateRequestId: string | null = null;

  if (hasPayGateCredentials()) {
    const result = await initiatePayGateTransaction({
      paygateId: process.env.PAYGATE_ID!,
      encryptionKey: process.env.PAYGATE_ENCRYPTION_KEY!,
      reference: order.orderNumber,
      amountCents: order.totalCents,
      currency: order.currency,
      returnUrl: `${getAppUrl()}/checkout/success?reference=${order.orderNumber}`,
      notifyUrl: `${getAppUrl()}/api/paygate/notify`,
      locale: "en",
      country: "ZAF",
      email: order.customerEmail,
    });

    paygateRequestId = result.payRequestId;

    await prisma.order.update({
      where: { orderNumber: order.orderNumber },
      data: {
        paygateRequestId,
      },
    });
  }

  return {
    orderNumber: order.orderNumber,
    paygateRequestId,
    mockPayment: !hasPayGateCredentials(),
  };
}

export async function getCheckoutOrder(orderNumber: string) {
  if (!process.env.DATABASE_URL) {
    return getDemoOrder(orderNumber);
  }

  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      tickets: {
        include: {
          event: true,
        },
      },
      discountCode: true,
    },
  });
}
