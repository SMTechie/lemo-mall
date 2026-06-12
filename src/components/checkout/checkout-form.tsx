"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import { CreditCard, Sparkles, Trash2 } from "lucide-react";
import { createCheckoutAction } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cartItemKey, useCart } from "@/components/cart/cart-provider";
import { formatMoney } from "@/lib/utils";

export function CheckoutForm({ user }: { user?: { name?: string | null; email?: string | null } }) {
  const cart = useCart();
  const [state, action, pending] = useActionState(createCheckoutAction, {});

  useEffect(() => {
    if (state.url) {
      cart.clear();
      window.location.href = state.url;
    }
  }, [state.url, cart]);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          cart.items.map((item) =>
            item.kind === "product"
              ? { kind: "product", productId: item.productId, quantity: item.quantity }
              : { kind: "ticket", ticketTypeId: item.ticketTypeId, quantity: item.quantity }
          )
        )}
      />
      <Card>
        <CardHeader>
          <CardTitle>Checkout details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="customerName">Name</Label>
            <Input id="customerName" name="customerName" defaultValue={user?.name ?? ""} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customerEmail">Email</Label>
            <Input id="customerEmail" type="email" name="customerEmail" defaultValue={user?.email ?? ""} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="discountCode">Promo code</Label>
            <Input id="discountCode" name="discountCode" placeholder="LAUNCH10" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="paymentMode">Payment option</Label>
            <select id="paymentMode" name="paymentMode" className="h-10 rounded-md border bg-background px-3 text-sm">
              <option value="FULL">Pay in full</option>
              <option value="DEPOSIT">Pay 50% deposit</option>
            </select>
          </div>
          <div className="rounded-lg border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-secondary" />
              Checkout upgrades
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" /> VIP upgrade at selected events</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Parking and drinks add-ons</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Add recommended merch before payment</label>
            </div>
          </div>
          {state.error ? <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p> : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.items.length === 0 ? <p className="text-sm text-muted-foreground">Your cart is empty.</p> : null}
          {cart.items.map((item) => (
            <div key={cartItemKey(item)} className="flex gap-3">
              {item.image ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.quantity} x {formatMoney(item.priceCents)}</p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => cart.remove(cartItemKey(item))} aria-label="Remove item">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Platform fees calculated securely</span>
              <span>At payment</span>
            </div>
            <div className="mt-2 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>{formatMoney(cart.totalCents)}</span>
            </div>
          </div>
          <Button className="w-full" disabled={pending || cart.items.length === 0}>
            <CreditCard className="h-4 w-4" />
            Pay with Yoco
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
