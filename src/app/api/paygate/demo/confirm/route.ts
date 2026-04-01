import { NextResponse } from "next/server";
import { getCheckoutOrder } from "@/lib/orders";
import { finalizePaidOrder } from "@/lib/tickets";
import { z } from "zod";

const schema = z.object({
  orderNumber: z.string().min(4),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order reference" }, { status: 400 });
  }

  const order = await getCheckoutOrder(parsed.data.orderNumber);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await finalizePaidOrder(order.orderNumber);

  return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
}
