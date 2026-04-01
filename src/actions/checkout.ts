"use server";

import { auth } from "@/auth";
import { createCheckoutOrder } from "@/lib/orders";
import { checkoutSchema } from "@/lib/validators";
import { redirect } from "next/navigation";

type CheckoutActionState = {
  error?: string;
};

export async function submitCheckout(
  _state: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  try {
    const rawItems = formData.get("items");
    const items = typeof rawItems === "string" ? JSON.parse(rawItems) : [];

    const parsed = checkoutSchema.parse({
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      notes: formData.get("notes"),
      discountCode: formData.get("discountCode"),
      shippingAddressLine1: formData.get("shippingAddressLine1"),
      shippingAddressLine2: formData.get("shippingAddressLine2"),
      shippingCity: formData.get("shippingCity"),
      shippingRegion: formData.get("shippingRegion"),
      shippingPostalCode: formData.get("shippingPostalCode"),
      shippingCountry: formData.get("shippingCountry"),
      items,
    });

    const session = await auth();

    const order = await createCheckoutOrder({
      ...parsed,
      userId: session?.user?.id ?? null,
    });

    redirect(
      order.mockPayment
        ? `/checkout/redirect?orderNumber=${encodeURIComponent(order.orderNumber)}&mock=1`
        : `/checkout/redirect?orderNumber=${encodeURIComponent(order.orderNumber)}`,
    );
    return {};
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to start checkout",
    };
  }
}
