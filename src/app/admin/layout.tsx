import Link from "next/link";
import { Store } from "lucide-react";
import { requireAdmin } from "@/lib/auth-utils";
import { AdminNav } from "@/components/admin/admin-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Operations Console" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const primaryRole = session.user.roles?.[0] ?? session.user.role ?? "STAFF";

  return (
    <div className="min-h-screen bg-muted/35">
      <AdminNav />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[280px]">
        <header className="sticky top-0 z-30 border-b bg-background/95 shadow-sm backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-semibold tracking-normal">Operations Console</h1>
                <Badge variant="outline">{primaryRole.replaceAll("_", " ")}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Admin - secure business workspace</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/">
                  <Store className="h-4 w-4" />
                  Storefront
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
