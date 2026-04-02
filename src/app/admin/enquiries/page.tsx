import { Mail, MessageSquareText } from "lucide-react";
import { updateEnquiryStatusAction } from "@/actions/enquiries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getAdminEnquiries } from "@/lib/site-data";
import { formatDateTime } from "@/lib/utils";

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
      return "border-[#91e4ff]/20 bg-[#91e4ff]/10 text-[#2b5b70]";
    case "IN_PROGRESS":
      return "border-[#7f9a65]/20 bg-[#e3ead8] text-[#5f7d47]";
    case "SPAM":
      return "border-[#ff6b4a]/20 bg-[#ff6b4a]/10 text-[#a65b50]";
    default:
      return "border-[#d7decf] bg-[#f7f9f3] text-[#5e6c5a]";
  }
}

export default async function AdminEnquiriesPage() {
  const enquiries = await getAdminEnquiries();
  const openCount = enquiries.filter((enquiry) => enquiry.status !== "RESOLVED").length;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-[#d7decf] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf2_100%)] p-8 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <p className="text-xs uppercase tracking-[0.28em] text-[#80916f]">Messages</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#132414]">
          Inbox and response queue
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5e6c5a]">
          Keep track of ticket questions, merch issues, event booking requests, and sponsorship
          leads from one place.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#5e6c5a]">
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {enquiries.length} total enquiries
          </div>
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {openCount} open items
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {enquiries.map((enquiry) => (
          <section
            key={enquiry.id}
            className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[#e3ead8] text-[#5f7d47]">{enquiry.type}</Badge>
                  <Badge className={statusClass(enquiry.status)}>{enquiry.status}</Badge>
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#132414]">
                  {enquiry.subject}
                </h2>
                <p className="text-sm text-[#5e6c5a]">
                  {enquiry.name} - {enquiry.email}
                </p>
                {enquiry.phone ? <p className="text-sm text-[#899885]">{enquiry.phone}</p> : null}
              </div>
              <MessageSquareText className="h-8 w-8 text-[#7f9a65]" />
            </div>

            <div className="mt-4 rounded-[24px] border border-[#dce5cf] bg-[#f7f9f3] p-4">
              <p className="text-sm leading-7 text-[#5e6c5a]">{enquiry.message}</p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#90a085]">
              <span>Source: {enquiry.source}</span>
              <span>Created {formatDateTime(enquiry.createdAt)}</span>
              {enquiry.resolvedAt ? <span>Resolved {formatDateTime(enquiry.resolvedAt)}</span> : null}
            </div>

            <form action={updateEnquiryStatusAction} className="mt-5 space-y-4">
              <input type="hidden" name="id" value={enquiry.id} />
              <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#5e6c5a]">Status</span>
                  <select
                    name="status"
                    defaultValue={enquiry.status}
                    className="h-11 w-full rounded-2xl border border-[#d7decf] bg-white px-4 text-sm text-[#132414] outline-none focus:border-[#7f9a65] focus:ring-2 focus:ring-[#7f9a65]/15"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#5e6c5a]">Internal notes</span>
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
                  className="inline-flex h-11 items-center rounded-full border border-[#d7decf] bg-[#f3f7ef] px-5 text-sm font-medium text-[#132414] transition hover:bg-[#e7eee0]"
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
