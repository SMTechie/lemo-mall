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

export default async function AdminTicketsPage() {
  const tickets = await getAdminTickets();

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Tickets</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f8f4e8]">Inspect and verify QR tickets</h1>
        <p className="mt-3 text-sm leading-7 text-white/70">
          Use the quick form to mark a ticket as used or void, or scan it again for a live check.
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <form action={verifyTicketNowAction} className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
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

          <form action={upsertTicketStatusAction} className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
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
            <Button type="submit" className="mt-4 w-full" variant="secondary">
              Update status
            </Button>
          </form>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <SectionHeading
            eyebrow="Ticket register"
            title="Current ticket list"
            description="This table mirrors the state of the verification app."
            className="mb-6"
          />
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-[24px] border border-white/10 bg-[#0b1020]/60 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#f8f4e8]">{ticket.code}</p>
                    <p className="text-sm text-white/55">
                      {ticket.event.title} • {ticket.status}
                    </p>
                    <p className="text-xs text-white/45">
                      {ticket.holderName ?? ticket.holderEmail ?? "Unknown"} •{" "}
                      {formatDateTime(ticket.event.startsAt)}
                    </p>
                  </div>
                  <div className="text-right text-xs text-white/45">
                    <p>{ticket.order?.orderNumber ?? "No order"}</p>
                    <p>{ticket.usedAt ? `Used ${formatDateTime(ticket.usedAt)}` : "Unused"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

