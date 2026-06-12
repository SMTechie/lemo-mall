import { transferTicketAction } from "@/actions/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TicketTransferForm({ ticketId }: { ticketId: string }) {
  return (
    <form action={transferTicketAction} className="mt-6 grid gap-2 rounded-lg border p-4 text-left">
      <input type="hidden" name="ticketId" value={ticketId} />
      <p className="text-sm font-semibold">Transfer ticket</p>
      <Input name="name" placeholder="Recipient name" />
      <Input name="email" type="email" placeholder="recipient@example.com" required />
      <Button size="sm" variant="outline">Transfer securely</Button>
    </form>
  );
}
