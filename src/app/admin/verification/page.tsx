import Link from "next/link";
import { ArrowUpRight, ScanLine, ShieldCheck, Smartphone, Ticket } from "lucide-react";
import type { ComponentType } from "react";
import { ScannerApp } from "@/components/scanner/scanner-app";
import { getAdminTickets, getAnalytics } from "@/lib/site-data";
import { formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Verification management",
  description: "Manage the Lemo Fest QR verification app, gate staff flow, and ticket scans.",
};

type AdminTicket = {
  id: string;
  code: string;
  status: string;
  holderName: string | null;
  holderEmail: string | null;
  usedAt: Date | string | null;
  event: {
    title: string;
    location: string;
  };
};

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#d7decf] bg-white p-5 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3ead8] text-[#6f8858]">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.24em] text-[#90a085]">{label}</span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#132414]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#5e6c5a]">{detail}</p>
    </div>
  );
}

export default async function AdminVerificationPage() {
  const [tickets, analytics] = await Promise.all([getAdminTickets(), getAnalytics()]);
  const verificationTickets = tickets as AdminTicket[];
  const usedTickets = verificationTickets.filter((ticket) => ticket.status === "USED");
  const validTickets = verificationTickets.filter((ticket) => ticket.status === "VALID");
  const recentScans = usedTickets.slice(0, 6);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-[#d7decf] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf2_100%)] p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#90a085]">Verification app</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#132414]">
              Gate staff portal.
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#5e6c5a]">
              Use this panel to keep scanning smooth, train staff, and review recent check-ins
              before the gates get busy.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f7f9f3] px-3 py-2 text-xs font-medium text-[#5e6c5a]">
                Admin access
              </span>
              <span className="rounded-full bg-[#f7f9f3] px-3 py-2 text-xs font-medium text-[#5e6c5a]">
                Staff scan
              </span>
              <span className="rounded-full bg-[#f7f9f3] px-3 py-2 text-xs font-medium text-[#5e6c5a]">
                Offline sync
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/verify"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#7f9a65] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(127,154,101,0.24)] transition hover:bg-[#6f8858]"
            >
              Open scanner
              <ScanLine className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/tickets"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#d7decf] bg-white px-5 text-sm font-medium text-[#132414] shadow-[0_12px_28px_rgba(15,35,18,0.05)] transition hover:bg-[#f3f6ef]"
            >
              Inspect tickets
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Ticket}
          label="Tickets sold"
          value={String(analytics.ticketsSold)}
          detail="Total tickets available in the live system."
        />
        <StatCard
          icon={ShieldCheck}
          label="Valid tickets"
          value={String(validTickets.length)}
          detail="Ready to scan at the gate."
        />
        <StatCard
          icon={Smartphone}
          label="Used scans"
          value={String(usedTickets.length)}
          detail="Tickets already checked in."
        />
        <StatCard
          icon={ScanLine}
          label="Open issues"
          value={String(analytics.openEnquiries)}
          detail="Support requests still waiting on reply."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Gate station</p>
              <h2 className="mt-2 text-xl font-semibold text-[#132414]">Scanner workspace</h2>
              <p className="mt-2 text-sm leading-7 text-[#5e6c5a]">
                Keep this card open on a phone or tablet. Staff can scan tickets, mark entries as
                used, and keep the queue moving.
              </p>
            </div>
            <div className="rounded-full border border-[#d7decf] bg-[#f7f9f3] px-3 py-2 text-xs font-medium text-[#5e6c5a]">
              PWA ready
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-[#dce5cf] bg-[#f7f9f3] p-4">
            <ScannerApp />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Gate checklist</p>
                <h2 className="mt-2 text-xl font-semibold text-[#132414]">Staff prep</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-7 text-[#5e6c5a]">
              <p>• Log in with an ADMIN or STAFF account before opening the scanner.</p>
              <p>• Keep the device online when possible so every scan syncs immediately.</p>
              <p>• If the signal drops, continue scanning and sync once coverage returns.</p>
              <p>• Use the printable ticket page or WhatsApp link for manual lookups.</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Recent scans</p>
                <h2 className="mt-2 text-xl font-semibold text-[#132414]">Last check-ins</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {recentScans.map((ticket) => (
                <div key={ticket.id} className="rounded-[22px] border border-[#dce5cf] bg-[#f7f9f3] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#132414]">{ticket.code}</p>
                      <p className="text-sm text-[#6f7d69]">
                        {ticket.holderName ?? ticket.holderEmail ?? "Guest"}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#e6f0dd] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#5f7d47]">
                      Used
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[#5e6c5a]">{ticket.event.title}</p>
                  <p className="mt-1 text-xs text-[#899885]">
                    {ticket.usedAt ? formatDateTime(ticket.usedAt) : "Just now"}
                  </p>
                </div>
              ))}
              {recentScans.length === 0 ? (
                <p className="text-sm leading-7 text-[#5e6c5a]">
                  No used tickets yet. Once scans start, they will appear here.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
