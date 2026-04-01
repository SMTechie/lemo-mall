import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Ticket } from "lucide-react";
import { CheckoutSuccessClient } from "@/components/checkout/checkout-success-client";
import { BackdropPanel } from "@/components/site/backdrop-panel";
import { Container } from "@/components/ui/container";
import { getCheckoutOrder } from "@/lib/orders";
import { createQrDataUrl } from "@/lib/qr";
import { formatCurrency, formatDateTime } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<{ reference?: string }>;
};

export const metadata = {
  title: "Order complete",
  description: "Order confirmation and ticket download page.",
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { reference } = await searchParams;

  if (!reference) {
    notFound();
  }

  const order = await getCheckoutOrder(reference);

  if (!order) {
    notFound();
  }

  const tickets = await Promise.all(
    order.tickets.map(async (ticket) => ({
      ...ticket,
      qrDataUrl: await createQrDataUrl(ticket.qrPayload),
    })),
  );

  return (
    <div className="py-16">
      <Container>
        <CheckoutSuccessClient />

        <div className="mx-auto max-w-4xl space-y-8">
          <BackdropPanel
            image="/lemofest/blog11.jpg"
            alt="Lemo Fest celebration crowd"
            contentClassName="p-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffcc66]/15">
                <CheckCircle2 className="h-6 w-6 text-[#ffcc66]" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">
                  Order confirmed
                </p>
                <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8]">
                  Thank you, {order.customerName}
                </h1>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Order {order.orderNumber} is {order.status.toLowerCase()} and your tickets are
                  available below.
                </p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-[#0b1020]/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Total</p>
                <p className="mt-2 text-2xl font-semibold text-[#f8f4e8]">
                  {formatCurrency(order.totalCents)}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-[#0b1020]/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Paid at</p>
                <p className="mt-2 text-base font-medium text-[#f8f4e8]">
                  {order.paidAt ? formatDateTime(order.paidAt) : "Pending confirmation"}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-[#0b1020]/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Email</p>
                <p className="mt-2 text-base font-medium text-[#f8f4e8]">{order.customerEmail}</p>
              </div>
            </div>
          </BackdropPanel>

          {tickets.length ? (
            <BackdropPanel
              image="/lemofest/event-img.png"
              alt="Lemo Fest ticket delivery crowd"
              contentClassName="p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">
                    Ticket delivery
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-[#f8f4e8]">Your QR tickets</h2>
                </div>
                <Ticket className="h-8 w-8 text-[#91e4ff]" />
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.code}
                    className="rounded-[28px] border border-white/10 bg-[#0b1020]/70 p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-[#ffcc66]">
                      {ticket.event.title}
                    </p>
                    <p className="mt-2 font-medium text-[#f8f4e8]">{ticket.code}</p>
                    <div className="mt-4 overflow-hidden rounded-[24px] bg-white p-4">
                      <Image
                        src={ticket.qrDataUrl}
                        alt={ticket.code}
                        width={240}
                        height={240}
                        className="h-auto w-full"
                      />
                    </div>
                    <Link
                      href={`/tickets/${ticket.code}`}
                      className="mt-4 inline-flex h-11 items-center rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b]"
                    >
                      Open ticket
                    </Link>
                  </div>
                ))}
              </div>
            </BackdropPanel>
          ) : (
            <BackdropPanel
              image="/lemofest/blog1.jpg"
              alt="Lemo Fest ticket pending"
              contentClassName="p-8"
            >
              <p className="text-lg font-semibold text-[#f8f4e8]">
                This order is awaiting ticket generation.
              </p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                If payment completed a moment ago, refresh in a few seconds while the PayGate
                notify callback finalizes the order.
              </p>
            </BackdropPanel>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              href="/events"
              className="inline-flex h-11 items-center rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
            >
              Browse more events
            </Link>
            <Link
              href="/shop"
              className="inline-flex h-11 items-center rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
