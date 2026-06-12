"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full shrink-0"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
