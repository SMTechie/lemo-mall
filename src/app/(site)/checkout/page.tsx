import { BackdropPanel } from "@/components/site/backdrop-panel";
import { Container } from "@/components/ui/container";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = {
  title: "Checkout",
  description: "Review your cart, enter customer details, and complete payment through PayGate.",
};

export default function CheckoutPage() {
  return (
    <div className="py-16">
      <Container>
        <BackdropPanel image="/lemofest/blog1.jpg" alt="Lemo Fest checkout atmosphere" contentClassName="mb-8 p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Checkout</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8] sm:text-5xl">
            Pay once, then get your tickets by email.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            People usually arrive here after choosing an event or adding a hoodie. The cart stays
            local, the order is checked on the server, and the payment handoff follows the PayGate
            flow.
          </p>
        </BackdropPanel>

        <CheckoutForm />
      </Container>
    </div>
  );
}
