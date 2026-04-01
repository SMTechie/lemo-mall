"use client";

import { useEffect, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Ticket } from "lucide-react";
import { useCart, type CartItem } from "./cart-provider";
import { formatCurrency } from "@/lib/utils";

type Props = {
  item: Omit<CartItem, "quantity">;
  label?: string;
  className?: string;
  maxQuantity?: number;
};

const DEFAULT_MAX_QUANTITY = 10;

export function PurchasePanel({
  item,
  label = "Add to cart",
  className,
  maxQuantity,
}: Props) {
  const { addItem } = useCart();
  const availableQuantity = maxQuantity ?? DEFAULT_MAX_QUANTITY;
  const isSoldOut = availableQuantity <= 0;
  const [quantity, setQuantity] = useState(isSoldOut ? 0 : 1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;

    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  const totalCents = quantity * item.unitPriceCents;
  const itemLabel = item.kind === "TICKET" ? "ticket" : "item";
  const itemLabelPlural = item.kind === "TICKET" ? "tickets" : "items";
  const ActionIcon = item.kind === "TICKET" ? Ticket : ShoppingBag;

  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-[#0b1020]/60 p-5 backdrop-blur ${className ?? ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">Quantity</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-white/68">
            Choose how many {itemLabelPlural} you want before adding them to the cart.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 p-1">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity === 1 || isSoldOut}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Decrease ${itemLabel} quantity`}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-8 px-1 text-center text-sm font-semibold text-white">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.min(availableQuantity, current + 1))}
            disabled={quantity === availableQuantity || isSoldOut}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Increase ${itemLabel} quantity`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">Total</p>
          <p className="mt-1 text-2xl font-semibold text-[#f8f4e8]">
            {formatCurrency(totalCents)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isSoldOut) return;
            addItem(item, quantity);
            setAdded(true);
          }}
          disabled={isSoldOut}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSoldOut ? (
            <ShoppingBag className="h-4 w-4" />
          ) : added ? (
            <Check className="h-4 w-4" />
          ) : (
            <ActionIcon className="h-4 w-4" />
          )}
          {isSoldOut ? "Sold out" : added ? "Added" : label}
        </button>
      </div>
    </div>
  );
}
