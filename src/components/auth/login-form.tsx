"use client";

import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { Chrome, Lock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const canUseGoogle = useMemo(
    () => Boolean(process.env.NEXT_PUBLIC_GOOGLE_LOGIN === "true"),
    [],
  );
  const canUseDemoAccess = useMemo(
    () => Boolean(process.env.NEXT_PUBLIC_DEMO_LOGIN === "true"),
    [],
  );

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        const result = await signIn("nodemailer", {
          email,
          callbackUrl,
          redirect: false,
        });

        setIsSubmitting(false);

        if (result?.error) {
          setMessage(result.error);
          return;
        }

        setMessage("Magic link sent. Check your inbox.");
      }}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70" htmlFor="email">
            Email address
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      {message ? (
        <p className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/70">
          {message}
        </p>
      ) : null}

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        <Mail className="h-4 w-4" />
        {isSubmitting ? "Sending..." : "Send magic link"}
      </Button>

      {canUseDemoAccess ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => signIn("demo-access", { email: "admin@lemofest.co.za", callbackUrl })}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
          >
            <ShieldCheck className="h-4 w-4" />
            Demo admin
          </button>
          <button
            type="button"
            onClick={() => signIn("demo-access", { email: "staff@lemofest.co.za", callbackUrl })}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
          >
            <Lock className="h-4 w-4" />
            Demo staff
          </button>
        </div>
      ) : null}

      {canUseGoogle ? (
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/6 px-5 text-sm font-medium text-[#f8f4e8] transition hover:bg-white/12"
        >
          <Chrome className="h-4 w-4" />
          Continue with Google
        </button>
      ) : null}
    </form>
  );
}
