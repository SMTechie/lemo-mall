import { LogOut } from "lucide-react";
import { adminLogoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  return (
    <form action={adminLogoutAction}>
      <Button type="submit" variant="outline" className="w-full shrink-0">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </form>
  );
}
