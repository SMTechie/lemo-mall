import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Download, Mail, MapPin, QrCode, ShieldCheck, Ticket, UserRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/qr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TicketTransferForm } from "@/components/customer/ticket-transfer-form";

export const dynamic = "force-dynamic";

export default async function TicketPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { code },
    include: { event: true, ticketType: true }
  });
  if (!ticket) notFound();

  const qrImage = ticket.qrImage ?? (await ticketQrDataUrl(ticket.code));
  const eventDate = ticket.event.startsAt.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const eventTime = ticket.event.startsAt.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <main className="bg-muted/30 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Card className="overflow-hidden shadow-lg">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <section className="relative min-h-[420px] overflow-hidden bg-foreground text-background">
              <Image src={ticket.event.bannerImage} alt={ticket.event.title} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.72))]" />
              <div className="relative flex min-h-[420px] flex-col justify-between p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={ticket.status === "VALID" ? "secondary" : "outline"}>{ticket.status}</Badge>
                  <Badge className="bg-accent text-accent-foreground">{ticket.ticketType.name}</Badge>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-white/80">
                    <ShieldCheck className="h-4 w-4" />
                    Official Lemo Fest ticket
                  </p>
                  <h1 className="mt-3 text-4xl font-bold tracking-normal text-white sm:text-5xl">{ticket.event.title}</h1>
                  <div className="mt-5 grid gap-3 text-sm text-white/85">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {eventDate} at {eventTime}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {ticket.event.location}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <CardContent className="flex flex-col p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-primary">Admit one</p>
                  <h2 className="mt-1 text-2xl font-bold tracking-normal">{ticket.ticketType.name}</h2>
                </div>
                <Ticket className="h-7 w-7 text-primary" />
              </div>

              <div className="mt-6 rounded-lg border bg-background p-4">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="grid gap-3 text-sm">
                    <p className="flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-primary" />
                      <span>
                        <span className="block text-xs text-muted-foreground">Ticket holder</span>
                        <span className="font-semibold">{ticket.holderName ?? "Guest"}</span>
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>
                        <span className="block text-xs text-muted-foreground">Email</span>
                        <span className="font-semibold">{ticket.holderEmail ?? "Not provided"}</span>
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <QrCode className="h-4 w-4 text-primary" />
                      <span>
                        <span className="block text-xs text-muted-foreground">Ticket code</span>
                        <span className="font-mono font-semibold">{ticket.code}</span>
                      </span>
                    </p>
                  </div>

                  <div className="rounded-lg border bg-white p-3">
                    <Image
                      src={qrImage}
                      alt={`QR code for ticket ${ticket.code}`}
                      width={220}
                      height={220}
                      unoptimized
                      className="h-56 w-56"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-md border border-primary/20 bg-primary/10 p-3 text-sm text-primary">
                Gate staff will scan this QR code to verify the holder name and ticket type. Each ticket has its own unique QR code.
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="flex-1">
                  <a href={qrImage} download={`${ticket.code}.png`}>
                    <Download className="h-4 w-4" />
                    Save QR code
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href={qrImage} target="_blank" rel="noreferrer">
                    <QrCode className="h-4 w-4" />
                    Open QR
                  </a>
                </Button>
              </div>

              <TicketTransferForm ticketId={ticket.id} />
            </CardContent>
          </div>
        </Card>
      </div>
    </main>
  );
}
