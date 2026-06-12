import Link from "next/link";
import { CheckCircle2, TicketCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { syncPaidOrderFromYoco } from "@/services/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId } = await searchParams;
  let syncFailed = false;

  if (orderId) {
    try {
      await syncPaidOrderFromYoco(orderId);
    } catch {
      syncFailed = true;
    }
  }

  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: { tickets: { include: { event: true, ticketType: true }, orderBy: { createdAt: "asc" } } }
      })
    : null;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-10">
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl font-bold tracking-normal">Payment received</h1>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Your confirmation is being finalized. If your tickets are ready, they are listed below with their own unique QR codes.
          </p>

          {syncFailed ? (
            <p className="mt-4 rounded-md border border-accent/30 bg-accent/10 p-3 text-sm text-accent-foreground">
              Yoco has not confirmed this order on this page yet. Your tickets will appear once the payment confirmation finishes processing.
            </p>
          ) : null}

          {order?.tickets.length ? (
            <div className="mt-6 grid gap-3 text-left">
              {order.tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.code}`}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <TicketCheck className="h-5 w-5 shrink-0 text-primary" />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{ticket.event.title}</span>
                      <span className="block truncate text-sm text-muted-foreground">{ticket.ticketType.name} - {ticket.holderName}</span>
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">{ticket.code}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">
              Ticket generation can take a moment after payment. Check your orders if they do not appear here immediately.
            </p>
          )}

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild><Link href="/account/orders">View orders</Link></Button>
            <Button asChild variant="outline"><Link href="/">Continue shopping</Link></Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
