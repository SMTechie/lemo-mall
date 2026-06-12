"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

export function CartButton() {
  const { count } = useCart();
  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/checkout">
        <ShoppingBag className="h-4 w-4" />
        {count}
      </Link>
    </Button>
  );
}
