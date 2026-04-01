"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { AlertTriangle, Camera, RefreshCcw, ScanLine, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatDateOnly } from "@/lib/utils";
import { parseTicketCodeFromQrValue } from "@/lib/qr";

type VerifiedTicketResponse = {
  valid: boolean;
  status: string;
  message: string;
  ticket: {
    code: string;
    status: string;
    holderName: string | null;
    holderEmail: string | null;
    usedAt: string | null;
    event: {
      title: string;
      startsAt: string;
      location: string;
    };
  } | null;
};

type QueueItem = {
  code: string;
  capturedAt: string;
};

const QUEUE_KEY = "lemo-scanner-queue";

export function ScannerApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [lastResult, setLastResult] = useState<VerifiedTicketResponse | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [status, setStatus] = useState("Camera idle");
  const [online, setOnline] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(QUEUE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as QueueItem[];
        if (Array.isArray(parsed)) {
          setQueue(parsed);
        }
      }
    } catch {
      // Ignore queue parse failures.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const queueCount = queue.length;

  const processScan = async (rawValue: string) => {
    const code = parseTicketCodeFromQrValue(rawValue);
    setStatus(`Scanned ${code}`);

    try {
      const response = await fetch("/api/tickets/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      const data = (await response.json()) as VerifiedTicketResponse;
      setLastResult(data);
      return;
    } catch {
      setQueue((current) => {
        if (current.some((entry) => entry.code === code)) {
          return current;
        }

        return [...current, { code, capturedAt: new Date().toISOString() }];
      });
      setStatus(`Queued ${code} for later sync`);
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const reader = new BrowserMultiFormatReader();
    let cancelled = false;

    setStatus("Starting camera...");

    reader
      .decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (result: { getText(): string } | undefined) => {
          if (cancelled) return;
          if (!result) return;
          const text = result.getText();
          await processScan(text);
        },
      )
      .then((controls) => {
        controlsRef.current = controls;
      })
      .catch(() => {
        setStatus("Camera unavailable");
      });

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, []);

  const syncQueue = async () => {
    if (queue.length === 0) return;
    setIsSyncing(true);

    const remaining: QueueItem[] = [];
    for (const item of queue) {
      try {
        const response = await fetch("/api/tickets/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: item.code }),
        });

        if (!response.ok) {
          remaining.push(item);
          continue;
        }

        const data = (await response.json()) as VerifiedTicketResponse;
        setLastResult(data);
      } catch {
        remaining.push(item);
      }
    }

    setQueue(remaining);
    setIsSyncing(false);
  };

  const hasSuccess = lastResult?.valid;
  const recentQueue = useMemo(() => queue.slice(-3).reverse(), [queue]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#ffcc66]">Scanner mode</p>
              <h1 className="mt-3 text-3xl font-semibold text-[#f8f4e8]">Verify tickets on mobile</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1020]/70 px-3 py-2 text-sm text-white/65">
              <Smartphone className="h-4 w-4 text-[#91e4ff]" />
              {online ? "Online" : "Offline"}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1020]/80 p-3">
            <video ref={videoRef} className="h-[26rem] w-full rounded-[22px] bg-black object-cover" />
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-[#ffcc66]" />
              {status}
            </span>
            <button
              type="button"
              onClick={() => {
                controlsRef.current?.stop();
                controlsRef.current = null;
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 transition hover:bg-white/12"
            >
              <ScanLine className="h-4 w-4" />
              Reset camera
            </button>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-[#f8f4e8]">Manual code entry</h2>
            <Button type="button" variant="secondary" onClick={syncQueue} disabled={!queueCount || isSyncing}>
              <RefreshCcw className="h-4 w-4" />
              Sync queue
            </Button>
          </div>
          <form
            className="mt-4 flex gap-3"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!manualCode.trim()) return;
              await processScan(manualCode);
              setManualCode("");
            }}
          >
            <Input
              value={manualCode}
              onChange={(event) => setManualCode(event.target.value)}
              placeholder="Paste ticket code or scanned URL"
            />
            <Button type="submit">Verify</Button>
          </form>
        </div>

        {queueCount ? (
          <div className="rounded-[32px] border border-[#ff6b4a]/20 bg-[#ff6b4a]/10 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#ffcc66]">Offline queue</p>
                <h2 className="mt-2 text-xl font-semibold text-[#f8f4e8]">
                  {queueCount} scans waiting to sync
                </h2>
              </div>
              <AlertTriangle className="h-6 w-6 text-[#ffcc66]" />
            </div>
            <div className="mt-4 space-y-2 text-sm text-white/70">
              {recentQueue.map((item) => (
                <div key={item.code} className="rounded-2xl border border-white/10 bg-[#0b1020]/60 p-3">
                  <p className="font-medium text-[#f8f4e8]">{item.code}</p>
                  <p className="text-xs text-white/45">{formatDateTime(item.capturedAt)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="space-y-6">
        <div
          className={`rounded-[32px] border p-6 backdrop-blur ${
            hasSuccess
              ? "border-emerald-400/20 bg-emerald-400/10"
              : "border-white/10 bg-white/6"
          }`}
        >
          <Badge className="bg-white/10 text-white">
            {hasSuccess ? "Valid ticket" : "Latest scan"}
          </Badge>
          <h2 className="mt-4 text-2xl font-semibold text-[#f8f4e8]">
            {lastResult?.message ?? "Waiting for a scan"}
          </h2>
          {lastResult?.ticket ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-[#0b1020]/70 p-4">
                <p className="text-sm uppercase tracking-[0.22em] text-[#ffcc66]">
                  {lastResult.ticket.event.title}
                </p>
                <p className="mt-2 text-lg font-medium text-[#f8f4e8]">
                  {lastResult.ticket.code}
                </p>
                <p className="mt-2 text-sm text-white/65">
                  Holder: {lastResult.ticket.holderName ?? lastResult.ticket.holderEmail}
                </p>
                <p className="mt-1 text-sm text-white/65">
                  Event date: {formatDateOnly(lastResult.ticket.event.startsAt)}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-[#0b1020]/70 p-4 text-sm text-white/70">
                Scan status: {lastResult.ticket.status}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-white/70">
              Camera scans, manual code entry, and offline queueing all feed into the same
              verification endpoint.
            </p>
          )}
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.24em] text-[#ffcc66]">Staff guidance</p>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-white/70">
            <li>Keep the camera centered on the QR code for faster decoding.</li>
            <li>Used tickets will show a warning and remain flagged in the database.</li>
            <li>Offline scans are stored locally and sync when the device comes back online.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
