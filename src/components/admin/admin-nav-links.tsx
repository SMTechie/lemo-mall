"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  LineChart,
  LifeBuoy,
  Mail,
  Package,
  Percent,
  QrCode,
  ReceiptText,
  RotateCcw,
  Settings,
  Tags,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  analytics: LineChart,
  campaigns: Mail,
  checkIn: ClipboardCheck,
  dashboard: BarChart3,
  discounts: Percent,
  events: CalendarDays,
  orders: ReceiptText,
  pricing: Tags,
  products: Package,
  refunds: RotateCcw,
  roles: Users,
  scanner: QrCode,
  settings: Settings,
  support: LifeBuoy,
  tenants: Building2,
  users: Users
} as const;

type AdminNavLink = {
  href: string;
  label: string;
  icon: keyof typeof icons;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavLink[];
};

export function AdminNavLinks({ groups, links }: { groups?: AdminNavGroup[]; links?: AdminNavLink[] }) {
  const pathname = usePathname();
  const navGroups = useMemo(() => groups ?? (links ? [{ label: "Navigation", items: links }] : []), [groups, links]);
  const activeGroups = useMemo(
    () =>
      navGroups
        .filter((group) => group.items.some((item) => (item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href))))
        .map((group) => group.label),
    [navGroups, pathname]
  );
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem("lemo-admin-nav-collapsed-groups");
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.filter((label): label is string => typeof label === "string") : [];
    } catch {
      return [];
    }
  });

  function toggleGroup(label: string) {
    setCollapsedGroups((current) => {
      const next = current.includes(label) ? current.filter((item) => item !== label) : [...current, label];
      localStorage.setItem("lemo-admin-nav-collapsed-groups", JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="flex min-w-max gap-2 lg:grid lg:min-w-0 lg:gap-5">
      {navGroups.map((group) => {
        const open = activeGroups.includes(group.label) || !collapsedGroups.includes(group.label);

        return (
          <div key={group.label} className="contents lg:grid lg:gap-1.5">
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              className="hidden h-8 items-center justify-between rounded-md px-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
              aria-expanded={open}
            >
              <span>{group.label}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", !open && "-rotate-90")} />
            </button>
            {open ? (
              <div className="contents lg:grid lg:gap-1">
                {group.items.map(({ href, label, icon }) => {
                  const Icon = icons[icon];
                  const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border bg-background px-3 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-foreground lg:w-full lg:gap-3 lg:rounded-md lg:border-0 lg:bg-transparent",
                        active && "border-primary/30 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
