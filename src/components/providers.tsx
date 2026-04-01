"use client";

import { CartProvider } from "@/components/cart/cart-provider";
import { SessionProvider } from "next-auth/react";
import { useEffect, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Ignore SW registration failures in unsupported environments.
    });
  }, []);

  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
