import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { WishlistButton } from "@/components/customer/wishlist-button";
import { ReviewForm } from "@/components/customer/review-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  return {
    title: event?.title ?? "Event",
    description: event?.description,
    openGraph: { images: event?.bannerImage ? [event.bannerImage] : [] }
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { ticketTypes: { where: { active: true }, orderBy: { priceCents: "asc" } } }
  });
  if (!event || !event.published) notFound();

  return (
    <main>
      <section className="relative min-h-[420px] overflow-hidden border-b">
        <Image src={event.bannerImage} alt={event.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-background/75" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 py-10 sm:px-6 lg:px-8">
          <Badge className="w-fit" variant="secondary">{event.ticketTypes.length > 0 ? "Tickets on sale" : "Opening soon"}</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-normal sm:text-6xl">{event.title}</h1>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{event.startsAt.toLocaleString("en-ZA", { dateStyle: "full", timeStyle: "short" })}</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{event.location}</span>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <article className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg text-muted-foreground">{event.description}</p>
          <div className="not-prose mt-6">
            <WishlistButton eventId={event.id} />
          </div>
          <div className="not-prose mt-8">
            <ReviewForm eventId={event.id} />
          </div>
        </article>
        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="text-xl font-semibold">Choose tickets</h2>
            {event.ticketTypes.length > 0 ? event.ticketTypes.map((ticket) => {
              const remaining = ticket.quantity - ticket.sold;
              return (
                <div key={ticket.id} className="rounded-md border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{ticket.name}</h3>
                      <p className="text-sm text-muted-foreground">{remaining} remaining</p>
                    </div>
                    <p className="font-semibold">{formatMoney(ticket.priceCents)}</p>
                  </div>
                  <div className="mt-4">
                    <AddToCartButton
                      item={{
                        kind: "ticket",
                        ticketTypeId: ticket.id,
                        eventId: event.id,
                        name: `${event.title} - ${ticket.name}`,
                        priceCents: ticket.priceCents,
                        image: event.bannerImage,
                        quantity: 1
                      }}
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="rounded-md border p-5">
                <h3 className="font-semibold">Ticket sales opening soon</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This event has been announced, but ticket tiers are not live yet. Please check back soon or contact support for updates.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
