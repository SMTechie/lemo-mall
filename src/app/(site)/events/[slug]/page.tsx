import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  Ticket,
  VenetianMask,
} from "lucide-react";
import { PurchasePanel } from "@/components/cart/purchase-panel";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllEvents, getEventBySlug } from "@/lib/site-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event not found",
    };
  }

  return {
    title: event.title,
    description: event.description,
  };
}

function getEventDateLabel(event: { startsAt: Date; displayDateLabel?: string | null }) {
  return event.displayDateLabel ?? formatDateTime(event.startsAt);
}

function shouldShowEndTime(event: { displayDateLabel?: string | null }) {
  return event.displayDateLabel?.toUpperCase() !== "TBC";
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const schedule = Array.isArray(event.schedule) ? event.schedule : [];
  const nextEvents = (await getAllEvents()).filter((entry) => entry.slug !== event.slug).slice(0, 3);

  return (
    <div className="py-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <Badge>{event.featured ? "Featured event" : "Event detail"}</Badge>
            <div className="space-y-4">
              <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8] sm:text-5xl">
                {event.title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                {event.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <div className="flex items-center gap-2 text-sm text-white/55">
                  <CalendarDays className="h-4 w-4 text-[#ffcc66]" />
                  Date & time
                </div>
                <p className="mt-2 text-lg font-medium text-[#f8f4e8]">
                  {getEventDateLabel(event)}
                </p>
                {event.endsAt && shouldShowEndTime(event) ? (
                  <p className="mt-1 text-xs text-white/45">Ends {formatDateTime(event.endsAt)}</p>
                ) : null}
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <div className="flex items-center gap-2 text-sm text-white/55">
                  <MapPin className="h-4 w-4 text-[#91e4ff]" />
                  Location
                </div>
                <p className="mt-2 text-lg font-medium text-[#f8f4e8]">{event.location}</p>
                {event.venue ? <p className="mt-1 text-xs text-white/45">{event.venue}</p> : null}
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/6 p-4 backdrop-blur">
            <div className="relative overflow-hidden rounded-[26px]">
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={960}
                height={720}
                className="h-[24rem] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050913] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-[#ffcc66]">
                  Tickets from
                </p>
                <p className="mt-2 text-3xl font-semibold text-[#f8f4e8]">
                  {formatCurrency(event.ticketPriceCents, event.currency)}
                </p>
              </div>
            </div>

            <div className="space-y-3 p-4">
              <PurchasePanel
                item={{
                  id: event.id,
                  kind: "TICKET",
                  slug: event.slug,
                  name: event.title,
                  unitPriceCents: event.ticketPriceCents,
                  imageUrl: event.imageUrl,
                  eventId: event.id,
                }}
                label="Add ticket"
              />
              <Link
                href="/checkout"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
              >
                <Ticket className="h-4 w-4" />
                Go to checkout
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[32px] border border-white/10 bg-white/6 p-6">
            <SectionHeading
              eyebrow="Schedule"
              title="What the night feels like"
              description="The JSON schedule is stored in Prisma so admin can update it without rebuilding the page."
              className="mb-6"
            />
            <div className="space-y-4">
              {schedule.map((slot) => {
                const entry = slot as {
                  time?: string;
                  title?: string;
                  description?: string;
                };

                return (
                <div
                  key={`${entry.time ?? "time"}-${entry.title ?? "title"}`}
                  className="flex gap-4 rounded-[20px] border border-white/10 bg-[#0b1020]/60 p-4"
                >
                  <div className="min-w-16 rounded-2xl bg-white/6 px-3 py-2 text-center text-sm font-semibold text-[#ffcc66]">
                    {entry.time}
                  </div>
                  <div>
                    <h3 className="font-medium text-[#f8f4e8]">{entry.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-white/65">{entry.description}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/6 p-6">
            <SectionHeading
              eyebrow="Venue"
              title="Everything guests need before arrival"
              description="Useful for guests, support staff, and the ticket verification flow."
              className="mb-6"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] border border-white/10 bg-[#0b1020]/60 p-4">
                <div className="flex items-center gap-2 text-sm text-white/55">
                  <Clock3 className="h-4 w-4 text-[#ff8f5c]" />
                  Entry guidance
                </div>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  Arrive 45 minutes early for QR scan, wristband issue, and bag checks.
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-[#0b1020]/60 p-4">
                <div className="flex items-center gap-2 text-sm text-white/55">
                  <ShieldCheck className="h-4 w-4 text-[#91e4ff]" />
                  Ticket status
                </div>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  Tickets move from valid to used after a successful staff scan.
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-[#0b1020]/60 p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-sm text-white/55">
                  <VenetianMask className="h-4 w-4 text-[#ffcc66]" />
                  Venue address
                </div>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  {event.address ?? event.location}
                </p>
              </div>
            </div>
          </div>
        </section>

        {nextEvents.length ? (
          <section className="mt-14">
            <SectionHeading
              eyebrow="More events"
              title="Keep browsing the season"
              description="Related upcoming events stay one click away."
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {nextEvents.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur"
                >
                  <p className="text-sm uppercase tracking-[0.22em] text-[#ffcc66]">Next up</p>
                  <h3 className="mt-3 text-xl font-semibold text-[#f8f4e8]">{entry.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">{entry.location}</p>
                  <Link
                    href={`/events/${entry.slug}`}
                    className="mt-4 inline-flex h-11 items-center rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
                  >
                    View event
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </div>
  );
}
