import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatCurrency, formatDateOnly } from "@/lib/utils";

type EventCardProps = {
  event: {
    id: string;
    slug: string;
    title: string;
    description: string;
    location: string;
    startsAt: Date;
    ticketPriceCents: number;
    currency: string;
    imageUrl: string;
    featured?: boolean;
    displayDateLabel?: string | null;
  };
};

export function EventCard({ event }: EventCardProps) {
  const dateLabel = event.displayDateLabel ?? formatDateOnly(event.startsAt);

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/6 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-white/20 animate-fade-up motion-reduce:animate-none">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        {event.featured ? (
          <Badge className="absolute left-4 top-4 bg-black/70 text-[#ffff00]">Featured</Badge>
        ) : null}
      </div>
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          <p className="line-clamp-2 text-sm leading-7 text-white/68">{event.description}</p>
        </div>
        <div className="space-y-2 text-sm text-white/65">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#ffff00]" />
            <span>{dateLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#ff2c55]" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-[#ffff00]" />
            <span>{formatCurrency(event.ticketPriceCents, event.currency)}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AddToCartButton
            item={{
              id: event.id,
              kind: "TICKET",
              slug: event.slug,
              name: event.title,
              unitPriceCents: event.ticketPriceCents,
              imageUrl: event.imageUrl,
              eventId: event.id,
            }}
            label="Buy ticket"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] transition hover:brightness-95"
          />
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex h-11 items-center rounded-full px-4 text-sm font-medium text-white/72 transition hover:text-white"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
