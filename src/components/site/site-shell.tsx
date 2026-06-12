"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { CartButton } from "@/components/cart/cart-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site/site-footer";
import { VisitTracker } from "@/components/site/visit-tracker";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

export function SiteShell({
  children,
  hasSession,
  hasStaffAccess
}: {
  children: React.ReactNode;
  hasSession: boolean;
  hasStaffAccess: boolean;
}) {
  const pathname = usePathname();
  const isConsole = pathname.startsWith("/admin");

  if (isConsole) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const primaryLinks = [
    { href: "/programme", label: "Home" },
    { href: "/lineup", label: "Line-up" },
    { href: "/shop", label: "Merch" },
    { href: "/highlights", label: "Highlights" },
    { href: "/contact", label: "Contact" }
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full border bg-foreground p-1 shadow-sm transition-transform group-hover:scale-105">
              <Image src="/lemofest-logo.svg" alt="Lemo Fest" fill sizes="48px" className="object-cover" priority />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-base font-black uppercase tracking-normal">Lemo Fest</span>
              <span className="block text-xs font-medium text-muted-foreground">Now or Never 2026</span>
            </span>
          </Link>
          <nav className="hidden items-center rounded-full border bg-muted/40 p-1 text-sm font-semibold md:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground",
                  isActive(link.href) && "bg-background text-foreground shadow-sm"
                )}
              >
                {link.label}
              </Link>
            ))}
            {hasSession ? (
              <>
                <Link className={cn("rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground", isActive("/account/orders") && "bg-background text-foreground shadow-sm")} href="/account/orders">Orders</Link>
                <Link className={cn("rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground", isActive("/account/wishlist") && "bg-background text-foreground shadow-sm")} href="/account/wishlist">Wishlist</Link>
              </>
            ) : null}
            {hasStaffAccess ? (
              <Link href="/admin" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground">
                <BriefcaseBusiness className="h-4 w-4" />
                Staff
              </Link>
            ) : null}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild className="hidden sm:inline-flex">
              <Link href="/events">Tickets</Link>
            </Button>
            <CartButton />
            <ThemeToggle />
            {hasSession ? (
              <form action={logoutAction}>
                <Button variant="ghost" size="sm">
                  Logout
                </Button>
              </form>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto border-t px-4 py-2 text-sm font-semibold sm:px-6 md:hidden lg:px-8">
          <Link href="/events" className={cn("whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-primary-foreground", isActive("/events") && "ring-2 ring-ring")}>Tickets</Link>
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground",
                isActive(link.href) && "bg-muted text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {hasSession ? <Link href="/account/orders" className="whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground">Orders</Link> : null}
          {hasStaffAccess ? <Link href="/admin" target="_blank" rel="noreferrer" className="whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground">Staff</Link> : null}
        </nav>
      </header>
      {children}
      <SiteFooter hasSession={hasSession} />
      <WhatsAppButton />
      <VisitTracker />
    </div>
  );
}
