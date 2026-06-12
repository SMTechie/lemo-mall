import { Smartphone, Wifi, ShieldCheck } from "lucide-react";
import { ScannerApp } from "@/components/scanner/scanner-app";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminScannerPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Access control</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal">Ticket scanner</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Scan QR tickets at the gate and mark each valid ticket as used instantly.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ScannerApp />
        <aside className="space-y-4">
          {[
            ["Mobile ready", Smartphone, "Works properly on mobile phones and tablets using the rear camera."],
            ["Live verification", Wifi, "Keep the device online so every scan checks the latest ticket status."],
            ["Secure check-in", ShieldCheck, "Accepted tickets are marked used immediately to prevent duplicate entry."]
          ].map(([title, Icon, copy]) => (
            <Card key={String(title)}>
              <CardContent className="p-5">
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="mt-3 font-semibold">{String(title)}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{String(copy)}</p>
              </CardContent>
            </Card>
          ))}
        </aside>
      </div>
    </div>
  );
}
