import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { AdminNavLinks, type AdminNavGroup } from "@/components/admin/admin-nav-links";
import { auth } from "@/auth";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: "dashboard", permission: null },
      { href: "/admin/analytics", label: "Analytics", icon: "analytics", permission: "view_analytics" }
    ]
  },
  {
    label: "Commerce",
    items: [
      { href: "/admin/orders", label: "Orders", icon: "orders", permission: "view_orders" },
      { href: "/admin/products", label: "Products", icon: "products", permission: "manage_products" },
      { href: "/admin/pricing", label: "Pricing", icon: "pricing", permission: "manage_events" },
      { href: "/admin/discounts", label: "Discounts", icon: "discounts", permission: "manage_discounts" },
      { href: "/admin/refunds", label: "Refunds", icon: "refunds", permission: "issue_refunds" }
    ]
  },
  {
    label: "Events & access",
    items: [
      { href: "/admin/events", label: "Events", icon: "events", permission: "manage_events" },
      { href: "/admin/check-in", label: "Check-in", icon: "checkIn", permission: "scan_tickets" },
      { href: "/admin/scanner", label: "Scanner", icon: "scanner", permission: "scan_tickets" }
    ]
  },
  {
    label: "People",
    items: [
      { href: "/admin/users", label: "Users", icon: "users", permission: "manage_users" },
      { href: "/admin/rbac", label: "Roles", icon: "roles", permission: "manage_users" },
      { href: "/admin/support", label: "Support", icon: "support", permission: "manage_orders" }
    ]
  },
  {
    label: "Growth",
    items: [{ href: "/admin/campaigns", label: "Campaigns", icon: "campaigns", permission: "manage_users" }]
  },
  {
    label: "Platform",
    items: [{ href: "/admin/tenants", label: "Tenants", icon: "tenants", permission: "manage_billing" }]
  },
  {
    label: "Account",
    items: [{ href: "/admin/settings", label: "Settings", icon: "settings", permission: null }]
  }
] as const;

export async function AdminNav() {
  const session = await auth();
  const permissions = session?.user.permissions ?? [];
  const visibleGroups: AdminNavGroup[] = navGroups
    .map((group) => ({
      label: group.label,
      items: group.items
        .filter((item) => !item.permission || permissions.includes(item.permission))
        .map(({ href, label, icon }) => ({ href, label, icon }))
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className="border-b bg-background lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-[280px] lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex min-h-16 items-center gap-3 border-b px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <Link href="/admin" className="block truncate font-semibold tracking-normal">
            Lemo Console
          </Link>
          <p className="truncate text-xs text-muted-foreground">Commerce and access control</p>
        </div>
      </div>
      <nav className="overflow-x-auto px-3 py-3 lg:grid lg:flex-1 lg:content-start lg:gap-5 lg:overflow-y-auto lg:overflow-x-hidden lg:py-4">
        <AdminNavLinks groups={visibleGroups} />
      </nav>
      <div className="border-t bg-background p-3">
        <AdminLogoutButton />
      </div>
    </aside>
  );
}
