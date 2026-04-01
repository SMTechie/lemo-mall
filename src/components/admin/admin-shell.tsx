import { auth } from "@/auth";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  GalleryVerticalEnd,
  Mail,
  Package,
  ShieldCheck,
  Sparkles,
  Tickets,
  Users,
  Newspaper,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/tickets", label: "Tickets", icon: Tickets },
  { href: "/admin/orders", label: "Orders", icon: Sparkles },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/gallery", label: "Gallery", icon: GalleryVerticalEnd },
  { href: "/admin/testimonials", label: "Testimonials", icon: Users },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { href: "/admin/social", label: "Social", icon: Newspaper },
  { href: "/verify", label: "Scanner", icon: ShieldCheck },
];

const footerLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/verify", label: "Scanner" },
  { href: "/contact", label: "Public contact" },
];

export async function AdminShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#050913]">
      <div className="border-b border-white/10 bg-[#07111f]/85 backdrop-blur-xl">
        <Container className="flex min-h-20 items-center justify-between gap-6 py-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Admin dashboard</p>
            <h1 className="mt-1 text-xl font-semibold text-[#f8f4e8]">Lemo Fest Control Room</h1>
          </div>
          <div className="text-right text-sm text-white/60">
            <p>{session?.user?.name ?? "Staff user"}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-[#91e4ff]">
              {session?.user?.role ?? "STAFF"}
            </p>
          </div>
        </Container>
      </div>

      <Container className="grid gap-8 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[28px] border border-white/10 bg-white/6 p-4 backdrop-blur">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/8 hover:text-[#f8f4e8]"
                >
                  <Icon className="h-4 w-4 text-[#ffcc66]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="space-y-8">{children}</main>
      </Container>

      <Container className="pb-10">
        <footer className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr_0.9fr]">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Maintenance</p>
              <h2 className="text-lg font-semibold text-[#f8f4e8]">
                Keep sales, support, and stock under control.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-white/60">
                This dashboard is where the team manages ticket sales, merch inventory, enquiries,
                and the QR scanner used at the gate.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#ffcc66]">
                Quick links
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
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#ffcc66]">
                Support
              </h3>
              <div className="space-y-3 text-sm text-white/65">
                <p>hello@lemofest.co.za</p>
                <p>Lemo Green Park, Johannesburg</p>
                <p>Mon to Fri, 09:00 to 17:00</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>Need help with maintenance or stock updates? Start with Enquiries.</p>
            <p>Kenworth Group Copyright 2026, All rights reserved.</p>
          </div>
        </footer>
      </Container>
    </div>
  );
}
