"use server";

import { auth } from "@/auth";
import { createCheckoutOrder } from "@/lib/orders";
import { checkoutSchema } from "@/lib/validators";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

type CheckoutActionState = {
  error?: string;
};

function formText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : undefined;
}

export async function submitCheckout(
  _state: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  try {
    const rawItems = formData.get("items");
    const items = typeof rawItems === "string" ? JSON.parse(rawItems) : [];

    const parsed = checkoutSchema.parse({
      customerName: formText(formData, "customerName"),
      customerEmail: formText(formData, "customerEmail"),
      customerPhone: formText(formData, "customerPhone"),
      notes: formText(formData, "notes"),
      discountCode: formText(formData, "discountCode"),
      shippingAddressLine1: formText(formData, "shippingAddressLine1"),
      shippingAddressLine2: formText(formData, "shippingAddressLine2"),
      shippingCity: formText(formData, "shippingCity"),
      shippingRegion: formText(formData, "shippingRegion"),
      shippingPostalCode: formText(formData, "shippingPostalCode"),
      shippingCountry: formText(formData, "shippingCountry"),
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
    if (error instanceof ZodError) {
      const shippingIssue = error.issues.find((issue) =>
        issue.path.some(
          (part) =>
            typeof part === "string" && part.toLowerCase().startsWith("shipping"),
        ),
      );

      return {
        error:
          shippingIssue?.message ??
          error.issues[0]?.message ??
          "Please check the checkout form and try again",
      };
    }

    return {
      error: error instanceof Error ? error.message : "Unable to start checkout",
    };
  }
}
