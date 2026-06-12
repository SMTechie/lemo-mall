import { Star } from "lucide-react";
import { createReviewAction } from "@/actions/customer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReviewForm({ productId, eventId }: { productId?: string; eventId?: string }) {
  return (
    <form action={createReviewAction} className="grid gap-3 rounded-lg border p-4">
      {productId ? <input type="hidden" name="productId" value={productId} /> : null}
      {eventId ? <input type="hidden" name="eventId" value={eventId} /> : null}
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 text-secondary" />
        <select name="rating" className="h-9 rounded-md border bg-background px-3 text-sm" defaultValue="5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>{rating} stars</option>
          ))}
        </select>
      </div>
      <Textarea name="comment" placeholder="Share a quick review" />
      <Button size="sm">Submit review</Button>
    </form>
  );
}
