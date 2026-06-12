import { NextResponse } from "next/server";
import { syncPaidOrderFromYoco, syncPaidOrderFromYocoCheckout } from "@/services/orders";

type YocoWebhookEvent = {
  type?: string;
  payload?: {
    id?: string;
    status?: string;
    metadata?: Record<string, string | null | undefined>;
    checkoutId?: string;
    checkout?: { id?: string };
  };
};

function checkoutIdFromEvent(event: YocoWebhookEvent) {
  return (
    event.payload?.metadata?.checkoutId ??
    event.payload?.metadata?.checkout_id ??
    event.payload?.checkoutId ??
    event.payload?.checkout?.id
  );
}

function orderIdFromEvent(event: YocoWebhookEvent) {
  return event.payload?.metadata?.orderId ?? event.payload?.metadata?.order_id;
}

export async function POST(request: Request) {
  let event: YocoWebhookEvent;

  try {
    event = (await request.json()) as YocoWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.type !== "payment.succeeded") {
    return NextResponse.json({ received: true });
  }

  const paymentReference = event.payload?.id;
  const checkoutId = checkoutIdFromEvent(event);
  const orderId = orderIdFromEvent(event);
  if (!checkoutId && !orderId) {
    return NextResponse.json({ received: true });
  }

  try {
    if (checkoutId) {
      await syncPaidOrderFromYocoCheckout(checkoutId, paymentReference);
    } else if (orderId) {
      await syncPaidOrderFromYoco(orderId, paymentReference);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Yoco webhook processing failed", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
