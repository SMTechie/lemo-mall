"use client";

import { LocalThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toaster";
import { CartProvider } from "@/components/cart/cart-provider";
import { PermissionProvider } from "@/hooks/usePermissions";

export function Providers({
  children,
  permissions = [],
  roles = []
}: {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
}) {
  return (
    <LocalThemeProvider>
      <PermissionProvider permissions={permissions} roles={roles}>
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </PermissionProvider>
    </LocalThemeProvider>
  );
}
