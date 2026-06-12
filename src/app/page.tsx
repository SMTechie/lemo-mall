import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, CreditCard, MapPin, MessageCircle, Music2, ShoppingBag, Star, TicketCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { experienceLanes, festivalHeroImage, festivalImages, festivalProgramme, festivalStats, lineupHighlights, patronQuotes } from "@/lib/lemofest";
import { formatMoney } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { FestivalCountdown } from "@/components/site/festival-countdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, events] = await Promise.all([
    prisma.product.findMany({ where: { active: true, featured: true }, take: 3, orderBy: { createdAt: "desc" } }),
    prisma.event.findMany({
      where: { published: true },
      include: { ticketTypes: { where: { active: true }, orderBy: { priceCents: "asc" } } },
      take: 3,
      orderBy: { startsAt: "asc" }
    })
  ]);

  return (
    <main>
      <section className="relative min-h-[700px] overflow-hidden border-b">
        <Image src={festivalHeroImage} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,hsl(var(--background)))]" />
        <div className="relative mx-auto flex min-h-[700px] max-w-7xl flex-col justify-center px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="w-fit">Re ja joy all year round</Badge>
              <Badge className="w-fit bg-accent text-accent-foreground">Now or Never</Badge>
            </div>
            <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-normal sm:text-7xl">
              Lemo Fest is back with a full-colour 2026 season.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">
              Tickets, stages, merch, bar-card support and festival updates for everyone moving with the Lemo Fest community.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/events">Buy tickets <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/programme">View programme</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" />WhatsApp support</a>
              </Button>
            </div>
          </div>
          <FestivalCountdown />
        </div>
      </section>

      <section className="border-b bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-7 sm:px-6 md:grid-cols-4 lg:px-8">
          {festivalStats.map(([value, label]) => (
            <div key={label} className="rounded-md border border-background/15 p-4">
              <p className="text-3xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-background/70">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            ["2026 programme", CalendarDays, "Multi-day festival experiences across Lemo Green Park and partner venues."],
            ["QR tickets", TicketCheck, "Secure checkout and scan-ready tickets for fast gate access."],
            ["Official merch", ShoppingBag, "Limited festival drops with live stock controls."],
            ["Bar-card help", CreditCard, "Refund guidance and balance support for returning patrons."]
          ].map(([title, Icon, copy]) => (
            <div key={String(title)} className="rounded-lg border bg-card p-4 shadow-sm">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 font-semibold">{String(title)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{String(copy)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-primary">Experience</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal">More than one kind of festival day</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {experienceLanes.map((lane) => (
            <div key={lane.title} className={`rounded-lg p-5 ${lane.tone}`}>
              <Star className="h-5 w-5" />
              <h3 className="mt-6 text-xl font-semibold">{lane.title}</h3>
              <p className="mt-2 text-sm opacity-85">{lane.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Line-up</p>
              <h2 className="mt-2 text-3xl font-bold tracking-normal">Stages are warming up</h2>
            </div>
            <Button asChild variant="outline"><Link href="/lineup">Line-up updates</Link></Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {lineupHighlights.map((item) => (
              <Card key={item.title} className="overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                  <div className="absolute left-3 top-3 rounded-md bg-background px-2.5 py-1 text-xs font-semibold">{item.stage}</div>
                </div>
                <CardContent className="p-5">
                  <Music2 className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Upcoming events</p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal">2026 Lemo Fest programme</h2>
          </div>
          <Button asChild variant="outline"><Link href="/programme">Full programme</Link></Button>
        </div>
        <div className="overflow-hidden rounded-lg border">
          {festivalProgramme.slice(0, 5).map((item) => (
            <div key={`${item.date}-${item.title}`} className="grid gap-3 border-b p-4 last:border-b-0 md:grid-cols-[160px_1fr_180px_150px] md:items-center">
              <p className="font-medium">{item.date}</p>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{item.venue}</p>
              </div>
              <Badge variant={item.status === "Opening soon" ? "outline" : "secondary"} className="w-fit">{item.status}</Badge>
              <Button asChild size="sm" variant="ghost" className="justify-start md:justify-center">
                <Link href={item.href}>Details</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {events.length > 0 ? (
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">Tickets</p>
                <h2 className="mt-2 text-3xl font-bold tracking-normal">Available online</h2>
              </div>
              <Button asChild variant="ghost"><Link href="/events">All tickets</Link></Button>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative aspect-[16/9]">
                    <Image src={event.bannerImage} alt={event.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="outline">{event.startsAt.toLocaleDateString("en-ZA", { dateStyle: "medium" })}</Badge>
                    <h3 className="mt-3 text-xl font-semibold">{event.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{event.ticketTypes[0] ? `From ${formatMoney(event.ticketTypes[0].priceCents)}` : "Opening soon"}</p>
                      <Button asChild size="sm"><Link href={`/events/${event.slug}`}>{event.ticketTypes[0] ? "Buy" : "Info"}</Link></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Merch</p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal">Festival essentials</h2>
          </div>
          <Button asChild variant="ghost"><Link href="/shop">Shop all</Link></Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/3]">
                <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </Link>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatMoney(product.priceCents)}</p>
                  </div>
                  <AddToCartButton item={{ kind: "product", productId: product.id, name: product.name, priceCents: product.priceCents, image: product.images[0], quantity: 1 }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-accent text-accent-foreground">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:items-center lg:px-8">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold"><Clock3 className="h-4 w-4" />Do not wait for the poster drop</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal">The best Lemo Fest plans start early.</h2>
            <p className="mt-3 max-w-2xl text-sm opacity-90">Book live ticketed experiences now, then come back for artist announcements, merch drops and venue updates.</p>
          </div>
          <Button asChild variant="secondary" size="lg">
            <Link href="/events">Choose tickets</Link>
          </Button>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-primary">Highlights</p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal">Moments from the Lemo Fest crowd</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {festivalImages.map((image, index) => (
                <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-lg border">
                  <Image src={image} alt={`Lemo Fest crowd highlight ${index + 1}`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          <aside className="space-y-4">
            {patronQuotes.map((quote) => (
              <Card key={quote.name}>
                <CardContent className="p-5">
                  <p className="text-lg font-medium">&ldquo;{quote.quote}&rdquo;</p>
                  <p className="mt-3 text-sm text-muted-foreground">{quote.name}</p>
                </CardContent>
              </Card>
            ))}
            <Button asChild variant="outline" className="w-full"><Link href="/highlights">View highlights</Link></Button>
          </aside>
        </div>
      </section>
    </main>
  );
}
