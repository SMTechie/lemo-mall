"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("sent");
      }}
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="subscribe-email">
          Email address
        </label>
        <input
          id="subscribe-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="h-12 w-full rounded-full border border-[#efc9c1] bg-white px-5 text-sm text-[#35120e] outline-none placeholder:text-[#a77770] focus:border-[#cc2b2f] focus:ring-2 focus:ring-[#cc2b2f]/15"
        />
        <Button type="submit" size="lg" className="whitespace-nowrap">
          Subscribe
        </Button>
      </div>
      <p className="text-sm leading-6 text-[#6f4d47]">
        {status === "sent"
          ? `Thanks, we'll send updates to ${email}.`
          : "Get ticket drops, event updates, and merch announcements by email."}
      </p>
    </form>
  );
}
