"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  GalleryVerticalEnd,
  LayoutDashboard,
  Mail,
  Newspaper,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Tickets,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  dashboard: LayoutDashboard,
  events: CalendarDays,
  tickets: Tickets,
  orders: LayoutDashboard,
  shop: ShoppingBag,
  customers: Users,
  messages: Mail,
  settings: Settings2,
  gallery: GalleryVerticalEnd,
  testimonials: Users,
  enquiries: Mail,
  news: Newspaper,
  verification: ShieldCheck,
} as const;

export type AdminIconKey = keyof typeof iconMap;

export type AdminNavItem = {
  href: string;
  label: string;
  iconKey: AdminIconKey;
};

type AdminSidebarProps = {
  navItems: AdminNavItem[];
};

export function AdminSidebar({ navItems }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="space-y-4">
      <div className="rounded-[28px] border border-[#d7decf] bg-white p-4 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = iconMap[item.iconKey];
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-[#ffff00] text-[#0b0b0b] shadow-[inset_0_0_0_1px_rgba(255,255,0,0.18)]"
                    : "text-[#5a6857] hover:bg-[#f3f6ef] hover:text-[#132414]",
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", active ? "text-[#0b0b0b]" : "text-[#92a284]")} />
                  {item.label}
                </span>
                {active ? <ChevronRight className="h-4 w-4 text-[#0b0b0b]" /> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
