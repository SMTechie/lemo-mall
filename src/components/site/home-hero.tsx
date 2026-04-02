import Link from "next/link";
import { Container } from "@/components/ui/container";

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden animate-fade-in motion-reduce:animate-none">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,11,11,0.84)_0%,rgba(11,11,11,0.68)_38%,rgba(11,11,11,0.18)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_16%,rgba(255,44,85,0.28),transparent_32%),radial-gradient(circle_at_22%_28%,rgba(255,255,0,0.1),transparent_30%)]" />

      <Container className="relative flex min-h-[100svh] items-center py-24 sm:py-28 lg:py-32">
        <div className="max-w-2xl animate-fade-up motion-reduce:animate-none">
          <p className="text-sm uppercase tracking-[0.48em] text-white/78 sm:text-base">2026</p>
          <h1 className="mt-6 text-[clamp(4.2rem,12vw,8.6rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-white">
            Lemo
            <br />
            Fest
          </h1>
          <p className="mt-6 text-sm uppercase tracking-[0.34em] text-white/78 sm:text-base">
            Now or Never
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/events"
              className="inline-flex h-12 items-center rounded-full bg-[#ffff00] px-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#0b0b0b] shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition hover:brightness-95"
            >
              Buy Tickets
            </Link>
            <Link
              href="/events"
              className="inline-flex h-12 items-center rounded-full border border-white/25 bg-[#111111]/75 px-6 text-sm font-medium uppercase tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm transition hover:bg-[#1b1b1b]/85"
            >
              View Schedule
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
