import { auth } from "@/auth";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await auth();
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge variant="secondary">Secure ZAR checkout</Badge>
        <h1 className="text-3xl font-bold tracking-normal">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Merch and tickets are processed in one secure Yoco payment. Tickets are delivered as QR codes after payment confirmation.
        </p>
      </div>
      <CheckoutForm user={session?.user} />
    </main>
  );
}
