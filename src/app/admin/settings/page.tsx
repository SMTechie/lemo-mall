import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { InfoDialog } from "@/components/admin/info-dialog";
import { getAnalytics } from "@/lib/site-data";

export const metadata = {
  title: "Settings",
  description: "Operational settings and integrations for the Lemo Fest website.",
};

export default async function AdminSettingsPage() {
  const analytics = await getAnalytics();

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-[#d7decf] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf2_100%)] p-8 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <p className="text-xs uppercase tracking-[0.28em] text-[#80916f]">Settings</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#132414]">
          Website operations
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5e6c5a]">
          Keep the platform maintainable with a central view of commerce, payments, email, and
          verification status.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SettingCard
          label="Tickets sold"
          value={String(analytics.ticketsSold)}
          note="Live commerce across ticket sales."
        />
        <SettingCard
          label="Revenue"
          value={`R ${(analytics.revenueCents / 100).toLocaleString("en-ZA")}`}
          note="Successful orders in the system."
        />
        <SettingCard
          label="Open enquiries"
          value={String(analytics.openEnquiries)}
          note="Messages waiting on a reply."
        />
        <SettingCard
          label="Low stock"
          value={String(analytics.lowStockProducts)}
          note="Products that need restocking."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Operational status</p>
          <h2 className="mt-2 text-xl font-semibold text-[#132414]">Services and integrations</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <StatusCard title="PayGate" status="Ready" tone="good" />
            <StatusCard title="Email" status="Demo mode" tone="warn" />
            <StatusCard title="Facebook sync" status="Fallback ready" tone="good" />
            <StatusCard title="Verification" status="Staff portal" tone="good" />
          </div>
        </div>

        <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">Quick actions</p>
          <h2 className="mt-2 text-xl font-semibold text-[#132414]">Most used admin tasks</h2>
          <div className="mt-6 space-y-3">
            <Link
              href="/admin/verification"
              className="flex items-center justify-between rounded-[22px] border border-[#dce5cf] bg-[#f7f9f3] px-4 py-3 text-sm text-[#132414] transition hover:bg-[#eef3e7]"
            >
              Open verification
              <Badge className="bg-[#e3ead8] text-[#5f7d47]">Staff</Badge>
            </Link>
            <Link
              href="/admin/social"
              className="flex items-center justify-between rounded-[22px] border border-[#dce5cf] bg-[#f7f9f3] px-4 py-3 text-sm text-[#132414] transition hover:bg-[#eef3e7]"
            >
              Sync Facebook posts
              <Badge className="bg-[#e3ead8] text-[#5f7d47]">Content</Badge>
            </Link>
            <Link
              href="/admin/enquiries"
              className="flex items-center justify-between rounded-[22px] border border-[#dce5cf] bg-[#f7f9f3] px-4 py-3 text-sm text-[#132414] transition hover:bg-[#eef3e7]"
            >
              Handle support messages
              <Badge className="bg-[#f4ecd3] text-[#9a7942]">Inbox</Badge>
            </Link>
          </div>

          <div className="mt-6 rounded-[24px] border border-[#dce5cf] bg-[#f7f9f3] p-4">
            <p className="text-sm font-medium text-[#132414]">Maintenance note</p>
            <p className="mt-2 text-sm leading-7 text-[#5e6c5a]">
              This page is a practical operations hub. Connect a real config table later if you want
              these values editable from the UI.
            </p>
            <div className="mt-4">
              <InfoDialog
                triggerLabel="Review setup"
                title="Operations checklist"
                description="Use this popup to review the site maintenance tasks the team should keep on top of."
              >
                <ul className="space-y-2">
                  <li>- Check PayGate payments and callbacks each day.</li>
                  <li>- Review open enquiries and mark them resolved.</li>
                  <li>- Keep merch stock levels updated before each event.</li>
                  <li>- Refresh social posts and gallery images after event weekends.</li>
                </ul>
              </InfoDialog>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SettingCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#d7decf] bg-white p-5 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
      <p className="text-xs uppercase tracking-[0.24em] text-[#90a085]">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#132414]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#5e6c5a]">{note}</p>
    </div>
  );
}

function StatusCard({
  title,
  status,
  tone,
}: {
  title: string;
  status: string;
  tone: "good" | "warn";
}) {
  return (
    <div className="rounded-[22px] border border-[#dce5cf] bg-[#f7f9f3] p-4">
      <p className="text-sm font-medium text-[#132414]">{title}</p>
      <p
        className={
          tone === "good"
            ? "mt-2 inline-flex rounded-full bg-[#e3ead8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#5f7d47]"
            : "mt-2 inline-flex rounded-full bg-[#f4ecd3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7942]"
        }
      >
        {status}
      </p>
    </div>
  );
}
