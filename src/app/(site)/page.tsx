import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CalendarDays,
  ScanLine,
  ShoppingBag,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { HomeHero } from "@/components/site/home-hero";
import { EventCard } from "@/components/site/event-card";
import { ProductCard } from "@/components/site/product-card";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { getHomeData } from "@/lib/site-data";

export const metadata = {
  title: "Home",
  description: "Lemo Fest - a clean summary of tickets, events, shop, gallery, and scanner tools.",
};

const platformLinks = [
  { href: "/events", label: "Events" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/verify", label: "Verify" },
  { href: "/contact", label: "Contact" },
];

type SummaryCardProps = {
  icon: LucideIcon;
  meta: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

function SummaryCard({ icon: Icon, meta, title, description, href, cta }: SummaryCardProps) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <Icon className="h-5 w-5 text-[#ffff00]" />
        <span className="text-xs uppercase tracking-[0.24em] text-white/45">{meta}</span>
      </div>
      <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-white/65">{description}</p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center text-sm font-medium text-[#ffff00] transition hover:text-white"
      >
        {cta}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </article>
  );
}

export default async function HomePage() {
  const { events, testimonials, gallery, products, analytics } = await getHomeData();
  const featuredEvents = events.slice(0, 3);
  const featuredProducts = products.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 2);

  const overviewCards: SummaryCardProps[] = [
    {
      icon: Ticket,
      meta: `${analytics.ticketsSold} sold`,
      title: "Tickets",
      description: "Pick a date, choose the number of passes you need, and finish the order in one flow.",
      href: "/events",
      cta: "Open tickets",
    },
    {
      icon: CalendarDays,
      meta: `${analytics.activeEvents} live`,
      title: "Events",
      description: "See the next events, the prices, and the detail pages before anyone heads out.",
      href: "/events#program",
      cta: "View schedule",
    },
    {
      icon: ShoppingBag,
      meta: `${analytics.activeProducts} pieces`,
      title: "Shop",
      description: "Buy the tee, hoodie, cap, or tote that people would actually wear after the event.",
      href: "/shop",
      cta: "Open shop",
    },
    {
      icon: Camera,
      meta: `${gallery.length} images`,
      title: "Gallery",
      description: "Look back at the crowd, the stage, and the best pictures before the next drop.",
      href: "/gallery",
      cta: "Browse gallery",
    },
    {
      icon: ScanLine,
      meta: "PWA ready",
      title: "Verify",
      description: "Use the phone scanner at the door, mark tickets as used, and sync later if the network drops.",
      href: "/verify",
      cta: "Open scanner",
    },
  ];

  return (
    <div className="pb-20">
      <HomeHero />

      <div className="relative z-10 bg-[#0b0b0b] pb-20">
        <section className="pt-16">
          <Container>
            <SectionHeading
              eyebrow="Home summary"
              title="Start with the main paths."
              description="The homepage should show what people actually do first: browse events, buy tickets, shop, look at photos, and verify at the gate."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {overviewCards.map((card) => (
                <SummaryCard key={card.title} {...card} />
              ))}
            </div>
          </Container>
        </section>

        <section className="mt-20">
          <Container>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur">
                <SectionHeading
                  eyebrow="Booking"
                  title="A simple path from browsing to buying."
                  description="Open an event, choose your ticket, add merch if you want it, then pay once and keep the QR ticket."
                />
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(17,17,17,0.96))] p-6 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Real example</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">
                  Nomsa books two Yanos Hip-Hop tickets and a hoodie in the same order.
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  She opens Lemo Fest Yanos Hip-Hop, adds 2 General Access tickets, picks the
                  Midnight Hoodie, pays once, and gets a QR ticket by email and WhatsApp. That
                  same ticket is what the scanner app validates at the gate.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/events/lemo-fest-yanos-hip-hop"
                    className="inline-flex h-11 items-center rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
                  >
                    Open example event
                  </Link>
                  <Link
                    href="/shop/midnight-hoodie"
                    className="inline-flex h-11 items-center rounded-full border border-white/20 bg-black/15 px-5 text-sm font-medium text-white transition hover:bg-black/30"
                  >
                    View the hoodie
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="events" className="mt-20">
          <Container>
            <SectionHeading
              eyebrow="Events"
              title="Upcoming events at a glance."
              description="The home page previews the next few dates; the events page carries the full schedule and ticket details."
              action={
                <Link
                  href="/events"
                  className="inline-flex items-center text-sm font-medium text-[#ffff00] transition hover:text-white"
                >
                  View all events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              }
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </Container>
        </section>

        <section className="mt-20">
          <Container>
            <SectionHeading
              eyebrow="Shop"
              title="Clothing people can wear after the show."
              description="The merch store sits beside the ticket flow so a guest can buy a tee or hoodie without starting over."
              action={
                <Link
                  href="/shop"
                  className="inline-flex items-center text-sm font-medium text-[#ffff00] transition hover:text-white"
                >
                  Open shop
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              }
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Container>
        </section>

        <section className="mt-20">
          <Container>
            <SectionHeading
              eyebrow="Testimonial"
              title="Short comments from real guests."
              description="A few honest quotes keep the landing page grounded."
            />
            <div className="grid gap-6 md:grid-cols-2">
              {featuredTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </Container>
        </section>

        <section className="mt-20">
          <Container>
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,44,85,0.18),rgba(17,17,17,0.95))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.32em] text-[#ffff00]">
                    Multi-page platform
                  </p>
                  <h2 className="max-w-2xl text-3xl font-semibold uppercase leading-tight text-white sm:text-4xl">
                    One site, one booking path.
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-white/70">
                    Tickets, apparel, gallery, social posts, and QR verification all live in the
                    same site, so people do not have to jump between separate tools.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  {platformLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex h-12 items-center rounded-full border border-white/10 bg-white/6 px-5 text-sm font-medium text-white transition hover:bg-white/12"
                    >
                      {link.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </div>
  );
}
