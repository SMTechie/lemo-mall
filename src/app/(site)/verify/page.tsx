import { BackdropPanel } from "@/components/site/backdrop-panel";
import { Container } from "@/components/ui/container";
import { ScannerApp } from "@/components/scanner/scanner-app";

export const metadata = {
  title: "Verification scanner",
  description: "Mobile-first QR scanner for staff and admin ticket verification.",
};

export default function VerifyPage() {
  return (
    <div className="py-16">
      <Container>
        <BackdropPanel
          image="/lemofest/event-img.png"
          alt="Lemo Fest gate and crowd"
          className="mb-8"
          contentClassName="p-8"
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Verification app</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8] sm:text-5xl">
            Gate scanner for staff.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            Open this on a phone or tablet at the gate. Scan QR tickets from the ticket page,
            WhatsApp, or email, and let offline scans sync later if the signal drops.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-white/55">
            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2">Scan QR</span>
            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2">Mark used</span>
            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2">Sync later</span>
          </div>
        </BackdropPanel>
        <ScannerApp />
      </Container>
    </div>
  );
}
