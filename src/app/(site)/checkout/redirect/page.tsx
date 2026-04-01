import Link from "next/link";
import { notFound } from "next/navigation";
import { BackdropPanel } from "@/components/site/backdrop-panel";
import { Container } from "@/components/ui/container";
import { DemoPaymentButton } from "@/components/paygate/demo-payment-button";
import { PayGateRedirectForm } from "@/components/paygate/paygate-redirect-form";
import { buildResponseChecksum } from "@/lib/paygate";
import { getCheckoutOrder } from "@/lib/orders";
import { getAppUrl } from "@/lib/qr";

type PageProps = {
  searchParams: Promise<{ orderNumber?: string; mock?: string }>;
};

export const metadata = {
  title: "Processing payment",
  description: "Redirecting your order to PayGate or demo confirmation.",
};

export default async function CheckoutRedirectPage({ searchParams }: PageProps) {
  const { orderNumber, mock } = await searchParams;

  if (!orderNumber) {
    notFound();
  }

  const order = await getCheckoutOrder(orderNumber);

  if (!order) {
    notFound();
  }

  const paygateId = process.env.PAYGATE_ID ?? "demo";
  const paygateKey = process.env.PAYGATE_ENCRYPTION_KEY ?? "";
  const checksum = buildResponseChecksum(
    {
      paygateId,
      payRequestId: order.paygateRequestId ?? "demo-request",
      reference: order.orderNumber,
    },
    paygateKey,
  );

  const shouldMock =
    mock === "1" ||
    !order.paygateRequestId ||
    !process.env.PAYGATE_ID ||
    !process.env.PAYGATE_ENCRYPTION_KEY;

  return (
    <div className="py-20">
      <Container>
        <BackdropPanel
          image="/lemofest/blog3.jpg"
          alt="Lemo Fest payment and crowd background"
          className="mx-auto max-w-2xl"
          contentClassName="p-8"
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Payment handoff</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8]">
            {shouldMock ? "Demo payment ready" : "Redirecting to PayGate"}
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Order {order.orderNumber} for {order.customerName} is ready for the final payment
            step.
          </p>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-[#0b1020]/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/45">Amount</p>
                <p className="mt-2 text-3xl font-semibold text-[#f8f4e8]">
                  R{(order.totalCents / 100).toFixed(2)}
                </p>
              </div>
              <Link
                href="/checkout"
                className="inline-flex h-11 items-center rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
              >
                Back to checkout
              </Link>
            </div>
          </div>

          <div className="mt-8">
            {shouldMock ? (
              <DemoPaymentButton orderNumber={order.orderNumber} />
            ) : (
              <div className="space-y-4">
                <p className="text-sm leading-7 text-white/65">
                  The form below posts directly to PayGate. If the browser blocks the redirect,
                  use the button to continue manually.
                </p>
                <PayGateRedirectForm
                  action="https://secure.paygate.co.za/payweb3/process.trans"
                  fields={{
                    PAY_REQUEST_ID: order.paygateRequestId ?? "",
                    CHECKSUM: checksum,
                  }}
                />
                <p className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/70">
                  Redirecting from {getAppUrl()}...
                </p>
                <p className="text-sm text-white/50">
                  If the browser blocks the auto-post, go back and try again.
                </p>
              </div>
            )}
          </div>
        </BackdropPanel>
      </Container>
    </div>
  );
}
