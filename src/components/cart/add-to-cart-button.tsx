"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { type CartItem, useCart } from "@/components/cart/cart-provider";

export function AddToCartButton({ item }: { item: CartItem }) {
  const cart = useCart();
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        cart.add(item);
        toast({ title: "Added to cart", description: item.name });
      }}
    >
      <ShoppingCart className="h-4 w-4" />
      Add
    </Button>
  );
}
