import { NextResponse } from "next/server";
import {
  isPayGateSuccess,
  parsePayGateBody,
  verifyPayGateResponseChecksum,
} from "@/lib/paygate";
import { prisma } from "@/lib/db";
import { getCheckoutOrder } from "@/lib/orders";
import { finalizePaidOrder } from "@/lib/tickets";

export async function POST(request: Request) {
  const body = await request.text();
  const payload = parsePayGateBody(body);

  if (!verifyPayGateResponseChecksum(payload, process.env.PAYGATE_ENCRYPTION_KEY ?? "")) {
    return NextResponse.json({ error: "Invalid checksum" }, { status: 400 });
  }

  const order = process.env.DATABASE_URL
    ? await prisma.order.findUnique({
        where: {
          orderNumber: payload.REFERENCE,
        },
      })
    : await getCheckoutOrder(payload.REFERENCE);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (isPayGateSuccess(payload)) {
    await finalizePaidOrder(order.orderNumber, {
      paygateRequestId: payload.PAY_REQUEST_ID,
      paygateTransactionId: payload.TRANSACTION_ID ?? payload.REQUEST_ID,
      paygateResultCode: payload.RESULT_CODE ?? payload.TRANSACTION_STATUS,
      paygateResultDesc: payload.RESPONSE_TEXT ?? payload.RESULT_DESC,
    });
  } else {
    if (process.env.DATABASE_URL) {
      await prisma.order.update({
        where: { orderNumber: order.orderNumber },
        data: {
          status: "FAILED",
          paygateRequestId: payload.PAY_REQUEST_ID,
          paygateTransactionId: payload.TRANSACTION_ID ?? payload.REQUEST_ID,
          paygateResultCode: payload.RESULT_CODE ?? payload.TRANSACTION_STATUS,
          paygateResultDesc: payload.RESPONSE_TEXT ?? payload.RESULT_DESC,
        },
      });
    }
  }

  return new Response("OK", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
