"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction, registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState(action, { error: undefined });
  const submitLabel = mode === "login" ? "Log in" : "Register";
  const pendingLabel = mode === "login" ? "Logging in" : "Creating account";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Log in" : "Create account"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4" aria-busy={pending}>
          {mode === "register" ? (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" autoComplete="name" disabled={pending} required />
            </div>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" disabled={pending} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} disabled={pending} required />
          </div>
          {mode === "login" ? (
            <Link className="w-fit text-sm font-medium text-primary underline-offset-4 hover:underline" href="/forgot-password">
              Forgot password?
            </Link>
          ) : null}
          {state?.error ? <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p> : null}
          <Button disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {pending ? pendingLabel : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
