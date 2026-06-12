"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { forgotPasswordAction, resetPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, {});

  return (
    <Card className="w-full max-w-md">
      <CardHeader><CardTitle>Reset password</CardTitle></CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4" aria-busy={pending}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" disabled={pending} required />
          </div>
          {state.error ? <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p> : null}
          {state.success ? <p className="rounded-md bg-primary/10 p-3 text-sm text-primary">{state.success}</p> : null}
          {state.resetUrl ? (
            <p className="rounded-md border p-3 text-xs text-muted-foreground">
              Dev reset link: <Link className="text-primary underline" href={state.resetUrl}>open reset page</Link>
            </p>
          ) : null}
          <Button disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {pending ? "Sending link" : "Send reset link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, {});

  return (
    <Card className="w-full max-w-md">
      <CardHeader><CardTitle>Choose a new password</CardTitle></CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4" aria-busy={pending}>
          <input type="hidden" name="token" value={token} />
          <div className="grid gap-2">
            <Label htmlFor="password">New password</Label>
            <Input id="password" name="password" type="password" autoComplete="new-password" disabled={pending} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" disabled={pending} required />
          </div>
          {state.error ? <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p> : null}
          {state.success ? <p className="rounded-md bg-primary/10 p-3 text-sm text-primary">{state.success}</p> : null}
          <Button disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {pending ? "Updating password" : "Update password"}
          </Button>
          {state.success ? <Button asChild variant="outline"><Link href="/login">Back to login</Link></Button> : null}
        </form>
      </CardContent>
    </Card>
  );
}
