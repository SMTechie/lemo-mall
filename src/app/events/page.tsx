import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Tickets" };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    include: { ticketTypes: { where: { active: true }, orderBy: { priceCents: "asc" } } },
    orderBy: { startsAt: "asc" }
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Tickets</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal">Book Lemo Fest experiences</h1>
          <p className="mt-3 text-muted-foreground">Browse upcoming events and secure scan-ready QR tickets.</p>
        </div>
        <Button asChild variant="outline"><Link href="/#programme">View programme</Link></Button>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {events.map((event) => {
          const cheapestTicket = event.ticketTypes[0];
          return (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative aspect-[16/8]">
                <Image src={event.bannerImage} alt={event.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <CardContent className="p-5">
                <Badge variant="secondary">{event.startsAt.toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}</Badge>
                <h2 className="mt-3 text-2xl font-semibold">{event.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{cheapestTicket ? `From ${formatMoney(cheapestTicket.priceCents)}` : "Opening soon"}</p>
                  <Button asChild><Link href={`/events/${event.slug}`}>{cheapestTicket ? "View tickets" : "Ticket info"}</Link></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {events.length === 0 ? (
          <Card className="lg:col-span-2">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold">Ticket sales are opening soon</h2>
              <p className="mt-2 text-sm text-muted-foreground">Check the programme for announced dates, or contact support for event updates.</p>
              <Button asChild className="mt-5"><Link href="/contact">Contact support</Link></Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
