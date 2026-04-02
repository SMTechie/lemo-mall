import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle";
import { AdminSidebar, type AdminNavItem } from "@/components/admin/admin-sidebar";
import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";
import { cookies } from "next/headers";

const navItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", iconKey: "dashboard" },
  { href: "/admin/events", label: "Events", iconKey: "events" },
  { href: "/admin/products", label: "Shop", iconKey: "shop" },
  { href: "/admin/customers", label: "Customers", iconKey: "customers" },
  { href: "/admin/orders", label: "Orders", iconKey: "orders" },
  { href: "/admin/tickets", label: "Tickets", iconKey: "tickets" },
  { href: "/admin/enquiries", label: "Messages", iconKey: "messages" },
  { href: "/admin/verification", label: "Verification", iconKey: "verification" },
  { href: "/admin/settings", label: "Settings", iconKey: "settings" },
];

function getInitials(name?: string | null) {
  if (!name) return "LF";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export async function AdminShell({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();
  const cookieStore = await cookies();
  const theme = cookieStore.get("lemo-admin-theme-v2")?.value === "light" ? "light" : "dark";
  const initials = getInitials(session?.user?.name);

  return (
    <div
      className={`admin-dashboard min-h-screen ${
        theme === "dark" ? "bg-[#0b0b0b] text-[#f8f4e8]" : "bg-[#f6f8f2] text-[#132414]"
      }`}
      data-theme={theme}
    >
      <div
        className={`pointer-events-none fixed inset-0 ${
          theme === "dark"
            ? "bg-[radial-gradient(circle_at_top,rgba(255,44,85,0.16),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(255,255,0,0.1),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,44,85,0.08),transparent_24%)]"
            : "bg-[radial-gradient(circle_at_top_right,rgba(127,154,101,0.14),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(166,180,134,0.12),transparent_32%)]"
        }`}
      />
      <div className="relative z-10">
        <header
          className={`sticky top-0 z-30 border-b backdrop-blur-xl ${
            theme === "dark"
              ? "border-white/10 bg-[#0b0b0b]/86"
              : "border-[#d9dfcf] bg-white/82"
          }`}
        >
          <div className="flex h-20 w-full items-center gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/lemofest/dugem-logos.png"
                alt="Lemo Fest"
                width={156}
                height={52}
                className="h-10 w-auto object-contain"
                priority
              />
              <div className="hidden border-l border-[#d9dfcf] pl-3 sm:block">
                <p
                  className={`text-[11px] uppercase tracking-[0.24em] ${
                    theme === "dark" ? "text-[#ffff00]" : "text-[#80916f]"
                  }`}
                >
                  Admin
                </p>
                <p className={`text-sm font-semibold ${theme === "dark" ? "text-[#f8f4e8]" : "text-[#132414]"}`}>
                  Lemo Fest operations hub
                </p>
              </div>
            </Link>

            <div className="hidden flex-1 items-center justify-center md:flex">
              <label
                className={`flex w-full max-w-xl items-center gap-3 rounded-full border px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)] ${
                  theme === "dark"
                    ? "border-white/10 bg-[#111111] text-[#d9d2bf]"
                    : "border-[#d9dfcf] bg-[#f7f9f3] text-[#708166]"
                }`}
              >
                <Search className="h-4 w-4 shrink-0" />
                <input
                  type="search"
                  placeholder="Search events, orders, customers, messages..."
                  className={`w-full bg-transparent text-sm outline-none ${
                    theme === "dark"
                      ? "text-[#f8f4e8] placeholder:text-[#8f8f8f]"
                      : "text-[#132414] placeholder:text-[#8f9a8b]"
                  }`}
                />
              </label>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <AdminThemeToggle initialTheme={theme} />
              <button
                type="button"
                className={`hidden h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium shadow-[0_12px_28px_rgba(15,35,18,0.05)] transition md:inline-flex ${
                  theme === "dark"
                    ? "border-white/10 bg-[#111111] text-[#f8f4e8] hover:bg-[#1a1a1a]"
                    : "border-[#d9dfcf] bg-white text-[#132414] hover:bg-[#f3f7ef]"
                }`}
              >
                <Bell className={`h-4 w-4 ${theme === "dark" ? "text-[#ffff00]" : "text-[#7f9a65]"}`} />
                Alerts
              </button>
              <div
                className={`flex items-center gap-3 rounded-full border px-3 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.05)] ${
                  theme === "dark"
                    ? "border-white/10 bg-[#111111]"
                    : "border-[#d9dfcf] bg-white"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    theme === "dark"
                      ? "bg-[#1a1a1a] text-[#f8f4e8]"
                      : "bg-[#dce5cf] text-[#132414]"
                  }`}
                >
                  {initials}
                </div>
                <div className="hidden text-right sm:block">
                  <p
                    className={`text-sm font-semibold ${
                      theme === "dark" ? "text-[#f8f4e8]" : "text-[#132414]"
                    }`}
                  >
                    {session?.user?.name ?? "Staff user"}
                  </p>
                  <p
                    className={`text-[11px] uppercase tracking-[0.22em] ${
                      theme === "dark" ? "text-[#d9d2bf]" : "text-[#80916f]"
                    }`}
                  >
                    {session?.user?.role ?? "STAFF"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid items-start gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
            <AdminSidebar navItems={navItems} />
          </div>

          <main className="min-w-0 space-y-6 pb-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
