"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

type AdminTheme = "light" | "dark";

const COOKIE_NAME = "lemo-admin-theme-v2";

function setThemeCookie(theme: AdminTheme) {
  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

function applyTheme(theme: AdminTheme) {
  const dashboard = document.querySelector<HTMLElement>(".admin-dashboard");
  if (dashboard) {
    dashboard.dataset.theme = theme;
  }
}

export function AdminThemeToggle({ initialTheme }: { initialTheme: AdminTheme }) {
  const [theme, setTheme] = useState<AdminTheme>(initialTheme);

  useEffect(() => {
    applyTheme(theme);
    setThemeCookie(theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
      className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium shadow-[0_12px_28px_rgba(15,35,18,0.05)] transition ${
        theme === "dark"
          ? "border-[#ffff00] bg-[#ffff00] text-[#0b0b0b] hover:brightness-95"
          : "border-[#d9dfcf] bg-white text-[#132414] hover:bg-[#f3f7ef]"
      }`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-pressed={theme === "dark"}
    >
      {theme === "light" ? (
        <MoonStar className="h-4 w-4 text-[#7f9a65]" />
      ) : (
        <SunMedium className="h-4 w-4 text-[#0b0b0b]" />
      )}
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}
