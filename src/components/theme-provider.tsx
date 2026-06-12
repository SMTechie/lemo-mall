"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";
type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = theme === "dark" || (theme === "system" && systemDark);
  document.documentElement.classList.toggle("dark", dark);
}

export function LocalThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    queueMicrotask(() => {
      const saved = (localStorage.getItem("lemo-theme") as Theme | null) ?? "system";
      setThemeState(saved);
      applyTheme(saved);
    });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("lemo-theme");
    if (theme === "system" && saved && saved !== "system") return;
    applyTheme(theme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme(next) {
        localStorage.setItem("lemo-theme", next);
        setThemeState(next);
        applyTheme(next);
      }
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useLocalTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useLocalTheme must be used inside LocalThemeProvider");
  return context;
}
