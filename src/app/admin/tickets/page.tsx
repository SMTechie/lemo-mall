import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAdminTickets } from "@/lib/site-data";
import { upsertTicketStatusAction, verifyTicketNowAction } from "@/actions/admin";
import { formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Manage tickets",
  description: "Inspect, verify, and update ticket status.",
};

function statusTone(status: string) {
  switch (status) {
    case "VALID":
      return "bg-[#e3ead8] text-[#5f7d47]";
    case "USED":
      return "bg-[#dce5cf] text-[#132414]";
    case "VOID":
      return "bg-[#f7e2df] text-[#a65b50]";
    default:
      return "bg-[#edf2ea] text-[#667261]";
  }
}

export default async function AdminTicketsPage() {
  const tickets = await getAdminTickets();
  const validCount = tickets.filter((ticket) => ticket.status === "VALID").length;
  const usedCount = tickets.filter((ticket) => ticket.status === "USED").length;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-[#d7decf] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf2_100%)] p-8 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <p className="text-xs uppercase tracking-[0.28em] text-[#80916f]">Tickets</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#132414]">
          Inspect and verify QR tickets
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5e6c5a]">
          Use the quick form to mark a ticket as used or void, or scan it again for a live check.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#5e6c5a]">
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {tickets.length} tickets
          </div>
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {validCount} valid
          </div>
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {usedCount} used
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <form
            action={verifyTicketNowAction}
            className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]"
          >
            <SectionHeading
              eyebrow="Quick verify"
              title="Manual code check"
              description="Useful when a staff member needs to verify a code without the camera."
              className="mb-6"
            />
            <Input name="code" placeholder="Ticket code or QR payload" required />
            <Button type="submit" className="mt-4 w-full">
              Verify ticket
            </Button>
          </form>

          <form
            action={upsertTicketStatusAction}
            className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]"
          >
            <SectionHeading
              eyebrow="Status editor"
              title="Manual ticket status update"
              description="Use this to force a ticket back to valid or void it."
              className="mb-6"
            />
            <Input name="code" placeholder="Ticket code" required />
            <Select name="status" className="mt-4">
              <option value="VALID">VALID</option>
              <option value="USED">USED</option>
              <option value="VOID">VOID</option>
            </Select>
            <Button
              type="submit"
              className="mt-4 w-full bg-[#dce5cf] text-[#132414] hover:bg-[#cddbc0]"
              variant="secondary"
            >
              Update status
            </Button>
          </form>
        </div>

        <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
          <SectionHeading
            eyebrow="Ticket register"
            title="Current ticket list"
            description="This table mirrors the state of the verification app."
            className="mb-6"
          />
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-[24px] border border-[#dce5cf] bg-[#f7f9f3] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#132414]">{ticket.code}</p>
                    <p className="text-sm text-[#5e6c5a]">
                      {ticket.event.title} - {ticket.status}
                    </p>
                    <p className="text-xs text-[#899885]">
                      {ticket.holderName ?? ticket.holderEmail ?? "Unknown"} -{" "}
                      {formatDateTime(ticket.event.startsAt)}
                    </p>
                  </div>
                  <div className="text-right text-xs text-[#899885]">
                    <p>{ticket.order?.orderNumber ?? "No order"}</p>
                    <p>{ticket.usedAt ? `Used ${formatDateTime(ticket.usedAt)}` : "Unused"}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusTone(
                      ticket.status,
                    )}`}
                  >
                    {ticket.status}
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#90a085]">
                    {ticket.event.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
