import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Share2, Ticket } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { createQrDataUrl } from "@/lib/qr";
import { getTicketByCode } from "@/lib/tickets";
import { formatDateTime } from "@/lib/utils";

type PageProps = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  const ticket = await getTicketByCode(code);

  if (!ticket) {
    return { title: "Ticket not found" };
  }

  return {
    title: `Ticket ${ticket.code}`,
    description: `Printable ticket for ${ticket.event.title}`,
  };
}

export default async function TicketPage({ params }: PageProps) {
  const { code } = await params;
  const ticket = await getTicketByCode(code);

  if (!ticket) {
    notFound();
  }

  const qrDataUrl = await createQrDataUrl(ticket.qrPayload);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(ticket.ticketUrl)}`;

  return (
    <div className="py-16">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge>{ticket.status.toLowerCase()}</Badge>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8]">
                {ticket.event.title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Ticket {ticket.code} for {ticket.holderName ?? ticket.order?.customerName ?? "Guest"}
              </p>
            </div>
            <Ticket className="h-10 w-10 text-[#ffcc66]" />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-white/10 bg-[#0b1020]/70 p-5">
              <Image
                src={qrDataUrl}
                alt={ticket.code}
                width={320}
                height={320}
                className="h-auto w-full rounded-[20px] bg-white p-4"
              />
              <div className="mt-4 space-y-2 text-sm text-white/70">
                <p>Event date: {formatDateTime(ticket.event.startsAt)}</p>
                <p>Location: {ticket.event.location}</p>
                <p>Order: {ticket.order?.orderNumber ?? "Unknown"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-[#ffcc66]">Status</p>
                <div className="mt-3 flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#91e4ff]" />
                  <p className="text-lg font-medium text-[#f8f4e8]">
                    {ticket.status === "USED" ? "Already used" : "Valid and ready for entry"}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Scan this QR code at the gate. The verification app will mark it as used after
                  a successful scan.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-[#ffcc66]">Share</p>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Use the share link for WhatsApp or open this ticket on another device.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25d366] px-5 text-sm font-semibold text-white"
                  >
                    <Share2 className="h-4 w-4" />
                    WhatsApp
                  </Link>
                  <Link
                    href="/verify"
                    className="inline-flex h-11 items-center rounded-full border border-white/10 bg-[#0b1020] px-5 text-sm font-medium text-[#f8f4e8] transition hover:bg-[#11182f]"
                  >
                    Open scanner
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
