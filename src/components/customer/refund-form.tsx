import { createRefundRequestAction } from "@/actions/customer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function RefundForm({ orderId }: { orderId: string }) {
  return (
    <form action={createRefundRequestAction} className="grid gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <Textarea name="reason" placeholder="Reason for refund request" required />
      <Button size="sm" variant="outline">Request refund</Button>
    </form>
  );
}
