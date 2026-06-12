"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useLocalTheme();
  const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(next)} aria-label="Toggle theme">
      <Icon className="h-4 w-4" />
    </Button>
  );
}
