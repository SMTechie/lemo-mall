import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { BackdropPanel } from "@/components/site/backdrop-panel";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = {
  title: "Contact",
  description: "Send enquiries for tickets, merch, events, sponsorships, and general support.",
};

const contactPoints = [
  {
    icon: Mail,
    title: "Email",
    detail: "hello@lemofest.co.za",
    href: "mailto:hello@lemofest.co.za",
  },
  {
    icon: Phone,
    title: "Phone",
    detail: "+27 11 555 9000",
    href: "tel:+27115559000",
  },
  {
    icon: MapPin,
    title: "Location",
    detail: "Lemo Green Park, Johannesburg",
    href: "https://maps.google.com/?q=Lemo+Green+Park+Johannesburg",
  },
];

export default function ContactPage() {
  return (
    <div className="py-16">
      <Container>
        <BackdropPanel image="/lemofest/blog1.jpg" alt="Lemo Fest crowd" contentClassName="p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Enquiries</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8] sm:text-5xl">
            Talk to the team.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            Use this form for ticket questions, merch orders, event bookings, sponsorships, and
            general support. Messages are tracked in the admin inbox so nothing gets lost.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/events"
              className="inline-flex h-11 items-center rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
            >
              Browse events
            </Link>
            <Link
              href="/shop"
              className="inline-flex h-11 items-center rounded-full border border-white/15 bg-black/20 px-5 text-sm font-medium text-white transition hover:bg-black/35"
            >
              Open shop
            </Link>
          </div>
        </BackdropPanel>

        <section className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Support"
              title="Reach the right part of the business"
              description="Keep ticketing, merch, and event enquiries in one route instead of scattered DMs."
            />
            <div className="grid gap-4">
              {contactPoints.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-white/20"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffff00]/10">
                      <Icon className="h-5 w-5 text-[#ffff00]" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                        {item.title}
                      </p>
                      <p className="mt-2 text-base font-medium text-[#f8f4e8]">{item.detail}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
            <SectionHeading
              eyebrow="New enquiry"
              title="Send the details once"
              description="The admin inbox will store the message, type, and status for follow-up."
              className="mb-6"
            />
            <ContactForm />
          </div>
        </section>
      </Container>
    </div>
  );
}
