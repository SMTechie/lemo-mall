import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user.permissions?.includes("view_orders")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  const csv = toCsv(
    orders.map((order) => ({
      orderNumber: order.orderNumber,
      status: order.status,
      customerEmail: order.customerEmail,
      subtotal: order.subtotalCents / 100,
      discount: order.discountCents / 100,
      total: order.totalCents / 100,
      items: order.items.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: order.createdAt.toISOString()
    }))
  );

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv",
      "content-disposition": `attachment; filename="orders.csv"`
    }
  });
}
