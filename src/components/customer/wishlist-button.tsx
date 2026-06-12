import { Heart } from "lucide-react";
import { toggleWishlistAction } from "@/actions/customer";
import { Button } from "@/components/ui/button";

export function WishlistButton({ productId, eventId }: { productId?: string; eventId?: string }) {
  return (
    <form action={toggleWishlistAction}>
      {productId ? <input type="hidden" name="productId" value={productId} /> : null}
      {eventId ? <input type="hidden" name="eventId" value={eventId} /> : null}
      <Button variant="outline">
        <Heart className="h-4 w-4" />
        Save
      </Button>
    </form>
  );
}
