"use client";

import { useEffect, useState } from "react";

const openingDate = new Date("2026-09-26T17:00:00+02:00").getTime();

function getCountdown() {
  const remainingMs = Math.max(0, openingDate - Date.now());
  return {
    days: Math.floor(remainingMs / 86_400_000),
    hours: Math.floor((remainingMs % 86_400_000) / 3_600_000),
    minutes: Math.floor((remainingMs % 3_600_000) / 60_000)
  };
}

export function FestivalCountdown() {
  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    const interval = window.setInterval(() => setCountdown(getCountdown()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="mt-12 grid max-w-3xl grid-cols-3 overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur">
      {[
        ["Days", countdown.days],
        ["Hours", countdown.hours],
        ["Minutes", countdown.minutes]
      ].map(([label, value]) => (
        <div key={String(label)} className="border-r border-white/20 p-4 last:border-r-0">
          <p className="text-3xl font-bold">{String(value).padStart(2, "0")}</p>
          <p className="mt-1 text-xs uppercase text-white/75">{label} to opening night</p>
        </div>
      ))}
    </div>
  );
}
