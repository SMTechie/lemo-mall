"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "./cart-provider";

type Props = {
  item: {
    id: string;
    kind: "TICKET" | "PRODUCT";
    slug: string;
    name: string;
    unitPriceCents: number;
    imageUrl: string;
    eventId?: string;
    productId?: string;
  };
  label?: string;
  className?: string;
};

export function AddToCartButton({ item, label = "Add to cart", className }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;

    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(item, 1);
        setAdded(true);
      }}
      className={
        className ??
        "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff8f5c] via-[#ff6b4a] to-[#ffcc66] px-5 text-sm font-semibold text-[#0b1020] transition hover:brightness-110"
      }
    >
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {added ? "Added" : label}
    </button>
  );
}

