"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem =
  | { kind: "product"; productId: string; name: string; priceCents: number; image?: string; quantity: number }
  | { kind: "ticket"; ticketTypeId: string; eventId: string; name: string; priceCents: number; image?: string; quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  totalCents: number;
  add: (item: CartItem) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "lemo-cart";

function key(item: CartItem) {
  return item.kind === "product" ? `p:${item.productId}` : `t:${item.ticketTypeId}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      const saved = localStorage.getItem(storageKey);
      if (saved) setItems(JSON.parse(saved));
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const totalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      totalCents,
      add(item) {
        setItems((current) => {
          const existing = current.find((entry) => key(entry) === key(item));
          if (!existing) return [...current, item];
          return current.map((entry) => (key(entry) === key(item) ? { ...entry, quantity: entry.quantity + item.quantity } : entry));
        });
      },
      remove(itemKey) {
        setItems((current) => current.filter((entry) => key(entry) !== itemKey));
      },
      clear() {
        setItems([]);
      }
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

export function cartItemKey(item: CartItem) {
  return key(item);
}
