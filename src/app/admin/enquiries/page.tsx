import { Mail, MessageSquareText } from "lucide-react";
import { updateEnquiryStatusAction } from "@/actions/enquiries";
import { getAdminEnquiries } from "@/lib/site-data";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const metadata = {
  title: "Manage enquiries",
  description: "Review contact, ticketing, merch, and sponsorship enquiries.",
};

const statusOptions = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "SPAM", label: "Spam" },
] as const;

function statusClass(status: string) {
  switch (status) {
    case "RESOLVED":
      return "border-[#91e4ff]/20 bg-[#91e4ff]/10 text-[#bfeeff]";
    case "IN_PROGRESS":
      return "border-[#ffcc66]/20 bg-[#ffcc66]/10 text-[#ffe4a8]";
    case "SPAM":
      return "border-[#ff6b4a]/20 bg-[#ff6b4a]/10 text-[#ffd7cf]";
    default:
      return "border-white/10 bg-white/6 text-[#f8f4e8]";
  }
}

export default async function AdminEnquiriesPage() {
  const enquiries = await getAdminEnquiries();
  const openCount = enquiries.filter((enquiry) => enquiry.status !== "RESOLVED").length;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Enquiries</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f8f4e8]">Inbox and response queue</h1>
        <p className="mt-3 text-sm leading-7 text-white/70">
          Keep track of ticket questions, merch issues, event booking requests, and sponsorship
          leads from one place.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
          <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
            {enquiries.length} total enquiries
          </div>
          <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
            {openCount} open items
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {enquiries.map((enquiry) => (
          <section
            key={enquiry.id}
            className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-black/40 text-[#ffcc66]">{enquiry.type}</Badge>
                  <Badge className={statusClass(enquiry.status)}>{enquiry.status}</Badge>
                </div>
                <h2 className="text-2xl font-semibold text-[#f8f4e8]">{enquiry.subject}</h2>
                <p className="text-sm text-white/60">
                  {enquiry.name} • {enquiry.email}
                </p>
                {enquiry.phone ? <p className="text-sm text-white/50">{enquiry.phone}</p> : null}
              </div>
              <MessageSquareText className="h-8 w-8 text-[#ffcc66]" />
            </div>

            <div className="mt-4 rounded-[24px] border border-white/10 bg-[#0b1020]/60 p-4">
              <p className="text-sm leading-7 text-white/75">{enquiry.message}</p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/45">
              <span>Source: {enquiry.source}</span>
              <span>Created {formatDateTime(enquiry.createdAt)}</span>
              {enquiry.resolvedAt ? <span>Resolved {formatDateTime(enquiry.resolvedAt)}</span> : null}
            </div>

            <form action={updateEnquiryStatusAction} className="mt-5 space-y-4">
              <input type="hidden" name="id" value={enquiry.id} />
              <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-white/70">Status</span>
                  <select
                    name="status"
                    defaultValue={enquiry.status}
                    className="h-11 w-full rounded-full border border-white/10 bg-[#0b1020]/60 px-4 text-sm text-[#f8f4e8]"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-[#0b1020]">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-white/70">Internal notes</span>
                  <Textarea
                    name="notes"
                    defaultValue={enquiry.notes ?? ""}
                    placeholder="Add a note for the team"
                    className="min-h-28"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="submit">Save update</Button>
                <a
                  href={`mailto:${enquiry.email}`}
                  className="inline-flex h-11 items-center rounded-full border border-white/10 bg-white/6 px-5 text-sm font-medium text-[#f8f4e8] transition hover:bg-white/12"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Reply by email
                </a>
              </div>
            </form>
          </section>
        ))}
      </div>
    </div>
  );
}
