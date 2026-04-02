import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";

const footerLinks = [
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/shop", label: "Shop" },
  { href: "/verify", label: "Verify" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://www.facebook.com/profile.php?id=100095293374770", label: "Facebook" },
  { href: "https://www.instagram.com/lemo.fest/", label: "Instagram" },
];

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative mt-24 overflow-hidden border-t border-white/10 bg-[#050505]/84 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,204,102,0.08),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,44,85,0.08),transparent_40%)]" />
      <Container className="relative z-10 grid gap-10 py-12 lg:grid-cols-[1.25fr_0.7fr_0.7fr]">
        <div className="space-y-4">
          <Image
            src="/lemofest/dugem-logos.png"
            alt="Lemo Fest"
            width={220}
            height={72}
            className="h-12 w-auto object-contain"
          />
          <p className="max-w-xl text-sm leading-7 text-white/60">
            Lemo Fest - Now or Never. A multi-page event platform for ticketing, merch,
            gallery moments, newsletter-style updates, and QR verification.
          </p>
          <p className="text-sm font-medium text-[#ffff00]">hello@lemofest.co.za</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#ffff00]">
            Explore
          </h3>
          <div className="space-y-3 text-sm text-white/65">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#ffff00]">
            Connect
          </h3>
          <div className="space-y-3 text-sm text-white/65">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <p>Lemo Green Park</p>
            <p>Johannesburg, South Africa</p>
          </div>
        </div>
      </Container>
      <Container className="relative z-10 pb-10">
        <p className="border-t border-white/10 pt-6 text-sm text-white/45">
          Kenworth Group Copyright 2026, All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
