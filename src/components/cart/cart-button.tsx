"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartButton() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/checkout"
      className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-[#111111] px-4 text-sm font-semibold text-[#f8f4e8] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:bg-[#1a1a1a]"
    >
      <ShoppingBag className="h-4 w-4 text-[#ffff00]" />
      <span>Cart</span>
      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#ffff00] px-2 py-0.5 text-xs font-semibold text-[#0b0b0b]">
        {totalItems}
      </span>
    </Link>
  );
}
