import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/password-reset-forms";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Reset password" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-4 py-10">
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-semibold">Missing reset token</h1>
            <p className="mt-2 text-sm text-muted-foreground">Request a new password reset link.</p>
            <Button asChild className="mt-4"><Link href="/forgot-password">Request reset</Link></Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
