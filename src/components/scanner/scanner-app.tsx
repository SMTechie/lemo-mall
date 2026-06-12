"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { Camera, CheckCircle2, Loader2, RotateCcw, Smartphone, Ticket, UserRound, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ScanResult = {
  ok?: boolean;
  error?: string;
  ticket?: {
    code: string;
    status: string;
    holderName?: string | null;
    holderEmail?: string | null;
    event: { title: string; startsAt?: string; location?: string };
    ticketType: { name: string };
  } | null;
  checkIn?: { total: number; checkedIn: number };
};

export function ScannerApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [running, setRunning] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [manualPayload, setManualPayload] = useState("");
  const [status, setStatus] = useState("Camera stopped");
  const [error, setError] = useState<string | null>(null);
  const secureContext = typeof window === "undefined" || window.isSecureContext || window.location.hostname === "localhost";
  const cameraSupported = typeof navigator === "undefined" || Boolean(navigator.mediaDevices?.getUserMedia);

  const verifyPayload = useCallback(async (payload: string) => {
    const trimmed = payload.trim();
    if (!trimmed) {
      setResult({ error: "Enter or scan a ticket code first." });
      return;
    }

    setVerifying(true);
    setResult(null);

    try {
      const res = await fetch("/api/tickets/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ payload: trimmed })
      });
      setResult(await res.json());
    } catch {
      setResult({ error: "Could not reach the verification server. Check your connection and try again." });
    } finally {
      setVerifying(false);
    }
  }, []);

  function submitManualCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void verifyPayload(manualPayload);
  }

  useEffect(() => {
    if (!running || !videoRef.current) return;

    const reader = new BrowserQRCodeReader();
    let active = true;
    let stop: (() => void) | undefined;

    async function startScanner() {
      if (!secureContext) {
        setError("Camera access needs HTTPS. Localhost works for testing; deployed scanners must use HTTPS.");
        setRunning(false);
        return;
      }

      if (!cameraSupported || !videoRef.current) {
        setError("This browser does not expose a camera API. Use Safari or Chrome on a phone or tablet.");
        setRunning(false);
        return;
      }

      setError(null);
      setStatus("Starting rear camera...");

      try {
        const controls = await reader.decodeFromConstraints(
          {
            audio: false,
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          },
          videoRef.current,
          async (scan, _scanError, scannerControls) => {
            stop = () => scannerControls.stop();
            if (!scan || !active) return;

            active = false;
            setStatus("Verifying ticket...");
            setRunning(false);

            await verifyPayload(scan.getText());
            scannerControls.stop();
            setStatus("Camera stopped");
          }
        );
        stop = () => controls.stop();
        setStatus("Scanning... point the camera at the ticket QR code.");
      } catch (scanError) {
        setError(scanError instanceof Error ? scanError.message : "Camera permission was denied or unavailable.");
        setRunning(false);
        setStatus("Camera stopped");
      }
    }

    startScanner();

    return () => {
      active = false;
      stop?.();
    };
  }, [cameraSupported, running, secureContext, verifyPayload]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>QR scanner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border bg-muted/40 p-3">
          <div className="flex items-start gap-3">
            <Smartphone className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Works best on mobile</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This scanner is optimized for phones and tablets using the rear camera. Use HTTPS in production and allow camera permission when prompted.
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-md border bg-black">
          <video ref={videoRef} className="aspect-[3/4] w-full bg-black object-cover sm:aspect-video" muted playsInline />
          {running ? (
            <div className="pointer-events-none absolute inset-6 rounded-lg border-2 border-primary/80 shadow-[0_0_0_999px_rgba(0,0,0,0.28)]" />
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{status}</p>
          <div className="flex gap-2">
            {running ? (
              <Button variant="outline" onClick={() => setRunning(false)}>
                <RotateCcw className="h-4 w-4" />
                Stop
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setResult(null);
                  setRunning(true);
                }}
                disabled={!secureContext || !cameraSupported || verifying}
              >
                <Camera className="h-4 w-4" />
                Start camera
              </Button>
            )}
          </div>
        </div>

        {running || verifying ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {verifying ? "Verifying ticket..." : "Hold the QR code inside the frame."}
          </div>
        ) : null}

        <form onSubmit={submitManualCode} className="grid gap-2 rounded-md border p-3 sm:grid-cols-[1fr_auto]">
          <Input
            value={manualPayload}
            onChange={(event) => setManualPayload(event.target.value)}
            placeholder="Enter ticket code or paste QR payload"
            disabled={verifying}
          />
          <Button type="submit" variant="outline" disabled={verifying}>
            {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ticket className="h-4 w-4" />}
            Verify
          </Button>
        </form>

        {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

        {result ? (
          <div className="rounded-md border p-4">
            {result.ok ? (
              <div className="flex items-start gap-3 text-primary">
                <CheckCircle2 className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Ticket accepted</p>
                  <TicketDetails result={result} />
                  {result.checkIn ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Checked in {result.checkIn.checkedIn} of {result.checkIn.total} tickets for this event.
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 text-destructive">
                <XCircle className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Scan rejected</p>
                  <p className="text-sm text-muted-foreground">{result.error}</p>
                  <TicketDetails result={result} />
                </div>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function TicketDetails({ result }: { result: ScanResult }) {
  if (!result.ticket) return null;

  return (
    <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">{result.ticket.event.title}</p>
      <p className="flex items-center gap-2">
        <Ticket className="h-4 w-4" />
        {result.ticket.ticketType.name}
      </p>
      {result.ticket.holderName ? (
        <p className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          {result.ticket.holderName}
        </p>
      ) : null}
      <p className="font-mono text-xs">{result.ticket.code}</p>
    </div>
  );
}
