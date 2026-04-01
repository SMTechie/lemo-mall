import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { CartButton } from "@/components/cart/cart-button";
import { Container } from "@/components/ui/container";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/events#program", label: "Schedule" },
  { href: "/verify", label: "Verify" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
];

export async function SiteHeader() {
  const session = await auth();
  const authHref = session?.user ? "/admin" : "/login";
  const authLabel = session?.user ? "Dashboard" : "Sign in";

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-black/20 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-4 sm:h-24">
        <Link
          href="/"
          className="inline-flex items-center border border-white/70 bg-black/15 px-3 py-2 text-white backdrop-blur-sm transition hover:border-white hover:bg-black/25"
        >
          <Image
            src="/lemofest/dugem-logos.png"
            alt="Lemo Fest"
            width={168}
            height={60}
            priority
            className="h-9 w-auto object-contain sm:h-11"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/90 lg:flex xl:gap-6">
          {navLinks.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CartButton />
          <Link
            href={authHref}
            className="inline-flex h-11 items-center rounded-full bg-[#ffff00] px-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
          >
            {authLabel}
          </Link>
        </div>

        <details className="relative lg:hidden">
          <summary className="flex h-11 cursor-pointer list-none items-center rounded-full border border-white/20 bg-black/20 px-4 text-sm font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            Menu
          </summary>
          <div className="absolute right-0 mt-3 w-72 rounded-[24px] border border-white/10 bg-[#120c0f]/96 p-4 shadow-2xl shadow-black/45 backdrop-blur-xl">
            <div className="space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="block rounded-2xl px-3 py-2 text-sm text-white/78 transition hover:bg-white/8 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="space-y-3">
                <div className="flex justify-start">
                  <CartButton />
                </div>
                <Link
                  href={authHref}
                  className="block rounded-full bg-[#ffff00] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
                >
                  {authLabel}
                </Link>
              </div>
            </div>
          </div>
        </details>
      </Container>
    </header>
  );
}
