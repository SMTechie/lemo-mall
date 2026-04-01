import Link from "next/link";
import { CalendarRange, Ticket } from "lucide-react";
import { BackdropPanel } from "@/components/site/backdrop-panel";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventCard } from "@/components/site/event-card";
import { getAllEvents } from "@/lib/site-data";

export const metadata = {
  title: "Events",
  description: "Browse upcoming Lemo Fest events, schedules, ticket tiers, and live line-ups.",
};

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <div className="py-16">
      <Container>
        <BackdropPanel
          image="/lemofest/upcoming-event-1.png"
          alt="Lemo Fest event crowd"
          contentClassName="p-8"
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Events & schedule</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8] sm:text-5xl">
            Pick an event that fits the day.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            Families, friends, and first-time guests can compare dates, prices, and venues before
            moving straight into checkout.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b]"
            >
              <Ticket className="h-4 w-4" />
              Browse shop
            </Link>
            <Link
              href="/verify"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
            >
              <CalendarRange className="h-4 w-4 text-[#0b0b0b]" />
              Open scanner
            </Link>
          </div>
        </BackdropPanel>
      </Container>

      <section id="program" className="mt-14">
        <Container>
          <SectionHeading
            eyebrow="Upcoming"
            title="Book ahead for the full lineup"
            description="Each card gives the basics. The detail page adds venue specifics, a schedule, and the add-to-cart flow."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
