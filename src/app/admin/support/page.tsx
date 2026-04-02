import Link from "next/link";
import { LifeBuoy, Mail, Phone, ShieldCheck, Ticket } from "lucide-react";
import type { ComponentType } from "react";
import { getAdminEnquiries, getAdminTickets } from "@/lib/site-data";
import { formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Support",
  description: "Help desk shortcuts and event operations support.",
};

export default async function AdminSupportPage() {
  const [enquiries, tickets] = await Promise.all([getAdminEnquiries(), getAdminTickets()]);
  const urgentEnquiries = enquiries.filter((item) => item.status !== "RESOLVED");
  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-[#d7decf] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf2_100%)] p-8 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <p className="text-xs uppercase tracking-[0.28em] text-[#80916f]">Support</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#132414]">
          Support and operations hub
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5e6c5a]">
          Keep the festival running with quick access to enquiries, verification, ticket checks,
          and the key team contacts.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SupportCard icon={LifeBuoy} title="Urgent enquiries" value={String(urgentEnquiries.length)} />
        <SupportCard icon={Ticket} title="Recent tickets" value={String(recentTickets.length)} />
        <SupportCard icon={ShieldCheck} title="Verification" value="Ready" />
        <SupportCard icon={Phone} title="Team line" value="+27 76 123 4567" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Help desk</p>
          <h2 className="mt-2 text-xl font-semibold text-[#132414]">Open support queue</h2>
          <div className="mt-6 space-y-4">
            {urgentEnquiries.map((item) => (
              <div key={item.id} className="rounded-[22px] border border-[#dce5cf] bg-[#f7f9f3] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#132414]">{item.subject}</p>
                    <p className="text-sm text-[#5e6c5a]">
                      {item.name} - {item.email}
                    </p>
                  </div>
                  <Mail className="h-5 w-5 text-[#7f9a65]" />
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#90a085]">
                  {item.type} - {formatDateTime(item.createdAt)}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/admin/enquiries"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-[#7f9a65] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(127,154,101,0.24)] transition hover:bg-[#6f8858]"
          >
            Open full inbox
          </Link>
        </div>

        <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Gate checklist</p>
          <h2 className="mt-2 text-xl font-semibold text-[#132414]">Staff reminders</h2>
          <div className="mt-6 space-y-3 text-sm leading-7 text-[#5e6c5a]">
            <p>- Confirm admin or staff login before opening the scanner.</p>
            <p>- Keep the device online where possible so scans sync instantly.</p>
            <p>- If the signal drops, continue scanning and sync once coverage returns.</p>
            <p>- Use the verification page for live QR checks and ticket lookups.</p>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/admin/verification"
              className="flex items-center justify-between rounded-[22px] border border-[#dce5cf] bg-[#f7f9f3] px-4 py-3 text-sm text-[#132414] transition hover:bg-[#eef3e7]"
            >
              Open verification
              <ShieldCheck className="h-4 w-4 text-[#7f9a65]" />
            </Link>
            <Link
              href="/admin/tickets"
              className="flex items-center justify-between rounded-[22px] border border-[#dce5cf] bg-[#f7f9f3] px-4 py-3 text-sm text-[#132414] transition hover:bg-[#eef3e7]"
            >
              Review tickets
              <Ticket className="h-4 w-4 text-[#7f9a65]" />
            </Link>
          </div>

          <div className="mt-6 rounded-[24px] border border-[#dce5cf] bg-[#f7f9f3] p-4">
            <p className="text-sm font-medium text-[#132414]">Emergency contact</p>
            <p className="mt-2 text-sm leading-7 text-[#5e6c5a]">
              Support queries can be routed through the main inbox and the live verification portal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SupportCard({
  icon: Icon,
  title,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#d7decf] bg-white p-5 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3ead8] text-[#6f8858]">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.24em] text-[#90a085]">{title}</span>
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-[#132414]">{value}</p>
    </div>
  );
}
