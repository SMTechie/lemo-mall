import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Mail, MapPin, MessageCircle, TicketCheck } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

const festivalLinks = [
  ["Home", "/programme"],
  ["Line-up", "/lineup"],
  ["Tickets", "/events"],
  ["Merch", "/shop"],
  ["Highlights", "/highlights"]
];

const supportLinks = [
  ["Contact", "/contact"],
  ["Help centre", "/help"],
  ["Bar-card refunds", "/bar-card-refunds"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Refunds", "/refunds"]
];

const currentYear = 2026;

export function SiteFooter({ hasSession = false }: { hasSession?: boolean }) {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="relative h-14 w-14 overflow-hidden rounded-full border border-background/20 bg-background/10 p-1">
                <Image src="/lemofest-logo.svg" alt="Lemo Fest" fill sizes="56px" className="object-cover" />
              </span>
              <span>
                <span className="block text-lg font-black uppercase tracking-normal">Lemo Fest</span>
                <span className="block text-xs font-medium text-background/60">Now or Never 2026</span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-6 text-background/70">
              Official festival tickets, merch, visitor support and bar-card help for the Lemo Fest community.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link href="/events">Buy tickets <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-background/25 bg-transparent text-background hover:bg-background/10">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" />WhatsApp</a>
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-background">Festival</p>
            <div className="mt-4 grid gap-2 text-sm text-background/65">
              {festivalLinks.map(([label, href]) => (
                <Link key={href} href={href} className="transition-colors hover:text-background">{label}</Link>
              ))}
              {hasSession ? <Link href="/account/settings" className="transition-colors hover:text-background">Account settings</Link> : null}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-background">Support</p>
            <div className="mt-4 grid gap-2 text-sm text-background/65">
              {supportLinks.map(([label, href]) => (
                <Link key={href} href={href} className="transition-colors hover:text-background">{label}</Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-background/15 bg-background/5 p-5">
            <p className="text-sm font-semibold text-background">Festival information</p>
            <div className="mt-4 grid gap-3 text-sm text-background/70">
              <p className="flex gap-2"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />Opening night starts 26 September 2026.</p>
              <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />Main programme hosted at Lemo Green Park.</p>
              <p className="flex gap-2"><TicketCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />QR tickets are delivered after successful checkout.</p>
              <p className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />Use Contact or WhatsApp for ticket and order support.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-background/10 pt-5 text-xs text-background/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} Lemo Fest. All rights reserved.</p>
          <p>Secure checkout, QR ticketing and visitor support.</p>
        </div>
      </div>
    </footer>
  );
}
