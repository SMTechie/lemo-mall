import "server-only";

import { absoluteUrl } from "@/lib/utils";

const yocoApiBase = process.env.YOCO_API_BASE ?? "https://payments.yoco.com/api";

type YocoCheckout = {
  id: string;
  redirectUrl: string;
  status: string;
  amount: number;
  currency: string;
  processingMode?: string;
};

function yocoSecretKey() {
  const key = process.env.YOCO_SECRET_KEY;
  if (!key) throw new Error("YOCO_SECRET_KEY is not configured.");
  return key;
}

async function yocoRequest<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${yocoApiBase}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${yocoSecretKey()}`,
      ...(init?.headers ?? {})
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.description ?? data?.detail ?? data?.message ?? "Yoco request failed.";
    throw new Error(message);
  }

  return data as T;
}

export async function createYocoCheckout(input: {
  orderId: string;
  orderNumber: string;
  amountCents: number;
  description: string;
}) {
  return yocoRequest<YocoCheckout>("/checkouts", {
    method: "POST",
    body: JSON.stringify({
      amount: input.amountCents,
      currency: "ZAR",
      cancelUrl: absoluteUrl(`/checkout?cancelled=1&order=${input.orderId}`),
      failureUrl: absoluteUrl(`/checkout?failed=1&order=${input.orderId}`),
      successUrl: absoluteUrl(`/checkout/success?order=${input.orderId}`),
      metadata: {
        orderId: input.orderId,
        orderNumber: input.orderNumber
      },
      description: input.description
    })
  });
}

export async function getYocoCheckout(checkoutId: string) {
  return yocoRequest<YocoCheckout>(`/checkouts/${encodeURIComponent(checkoutId)}`);
}

export function isYocoPaidStatus(status?: string | null) {
  return ["paid", "successful", "succeeded", "success", "complete", "completed"].includes(String(status ?? "").toLowerCase());
}
