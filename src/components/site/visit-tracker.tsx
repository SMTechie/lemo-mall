"use client";

import { useEffect } from "react";

export function VisitTracker() {
  useEffect(() => {
    const key = localStorage.getItem("lemo-visitor") ?? crypto.randomUUID();
    localStorage.setItem("lemo-visitor", key);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", JSON.stringify({ path: window.location.pathname, sessionKey: key }));
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: window.location.pathname, sessionKey: key }),
        keepalive: true
      });
    }
  }, []);

  return null;
}
