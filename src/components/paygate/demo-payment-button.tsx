"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DemoPaymentButton({ orderNumber }: { orderNumber: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-2xl border border-[#ff6b4a]/30 bg-[#ff6b4a]/10 px-4 py-3 text-sm text-[#ffd7cf]">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        className="w-full"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError(null);

          const response = await fetch("/api/paygate/demo/confirm", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderNumber }),
          });

          setLoading(false);

          if (!response.ok) {
            const data = (await response.json().catch(() => null)) as { error?: string } | null;
            setError(data?.error ?? "Could not confirm demo payment");
            return;
          }

          window.location.href = `/checkout/success?reference=${encodeURIComponent(orderNumber)}`;
        }}
      >
        {loading ? "Confirming..." : "Confirm demo payment"}
      </Button>
    </div>
  );
}

