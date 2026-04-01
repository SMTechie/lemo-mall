"use client";

import { useMemo, useActionState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { submitCheckout } from "@/actions/checkout";

type CheckoutState = {
  error?: string;
};

export function CheckoutForm() {
  const { items, subtotalCents, clearCart, removeItem, updateQuantity } = useCart();
  const hasProducts = useMemo(
    () => items.some((item) => item.kind === "PRODUCT"),
    [items],
  );

  const [state, formAction, isPending] = useActionState<CheckoutState, FormData>(
    submitCheckout,
    {},
  );

  if (items.length === 0) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-white/6 p-8 text-center backdrop-blur">
        <h2 className="text-2xl font-semibold text-[#f8f4e8]">Your cart is empty</h2>
        <p className="mt-3 text-sm leading-7 text-white/70">
          Add an event ticket or merch item before checking out.
        </p>
        <Link
          href="/events"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-gradient-to-r from-[#ff8f5c] via-[#ff6b4a] to-[#ffcc66] px-5 text-sm font-semibold text-[#0b1020]"
        >
          Browse events
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <div className="space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <h2 className="text-2xl font-semibold text-[#f8f4e8]">Checkout details</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-1">
              <label className="text-sm font-medium text-white/70" htmlFor="customerName">
                Full name
              </label>
              <Input id="customerName" name="customerName" required placeholder="Your name" />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <label className="text-sm font-medium text-white/70" htmlFor="customerEmail">
                Email address
              </label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <label className="text-sm font-medium text-white/70" htmlFor="customerPhone">
                Phone number
              </label>
              <Input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                placeholder="+27 82 555 0101"
              />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <label className="text-sm font-medium text-white/70" htmlFor="discountCode">
                Discount code
              </label>
              <Input id="discountCode" name="discountCode" placeholder="LEMO10" />
            </div>
          </div>
        </div>

        {hasProducts ? (
          <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold text-[#f8f4e8]">Shipping address</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-white/70" htmlFor="shippingAddressLine1">
                  Address line 1
                </label>
                <Input id="shippingAddressLine1" name="shippingAddressLine1" required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-white/70" htmlFor="shippingAddressLine2">
                  Address line 2
                </label>
                <Input id="shippingAddressLine2" name="shippingAddressLine2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70" htmlFor="shippingCity">
                  City
                </label>
                <Input id="shippingCity" name="shippingCity" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70" htmlFor="shippingRegion">
                  Province / region
                </label>
                <Input id="shippingRegion" name="shippingRegion" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70" htmlFor="shippingPostalCode">
                  Postal code
                </label>
                <Input id="shippingPostalCode" name="shippingPostalCode" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70" htmlFor="shippingCountry">
                  Country
                </label>
                <Input id="shippingCountry" name="shippingCountry" defaultValue="South Africa" />
              </div>
            </div>
          </div>
        ) : null}

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <h2 className="text-2xl font-semibold text-[#f8f4e8]">Notes</h2>
          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium text-white/70" htmlFor="notes">
              Special instructions
            </label>
            <Textarea id="notes" name="notes" placeholder="Anything the team should know?" />
          </div>
        </div>

        {state?.error ? (
          <div className="rounded-[24px] border border-[#ff6b4a]/30 bg-[#ff6b4a]/10 px-4 py-3 text-sm text-[#ffd7cf]">
            {state.error}
          </div>
        ) : null}
      </div>

      <aside className="space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <h2 className="text-2xl font-semibold text-[#f8f4e8]">Order summary</h2>
          <div className="mt-6 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 rounded-[20px] border border-white/10 bg-[#0b1020]/60 p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-[#f8f4e8]">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    {item.kind === "TICKET" ? "Ticket" : "Merch"} x {item.quantity}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/6 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-7 px-1 text-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex h-8 items-center gap-1 rounded-full border border-white/10 bg-white/6 px-3 text-xs font-medium text-white/65 transition hover:bg-white/12 hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-medium text-[#f8f4e8]">
                  {formatCurrency(item.quantity * item.unitPriceCents)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-4 text-sm">
            <div className="flex items-center justify-between text-white/65">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotalCents)}</span>
            </div>
            <div className="flex items-center justify-between text-white/65">
              <span>Delivery / fees</span>
              <span>Calculated by PayGate</span>
            </div>
          </div>

          <Button className="mt-6 w-full" type="submit" disabled={isPending}>
            {isPending ? "Processing..." : "Proceed to payment"}
          </Button>

          <button
            type="button"
            onClick={clearCart}
            className="mt-3 w-full rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/12"
          >
            Clear cart
          </button>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.24em] text-[#ffcc66]">Secure flow</p>
          <p className="mt-3 text-sm leading-7 text-white/70">
            The server action validates the cart, creates the order in PostgreSQL, and then hands
            off to PayGate or the demo confirmation route.
          </p>
        </div>
      </aside>
    </form>
  );
}
