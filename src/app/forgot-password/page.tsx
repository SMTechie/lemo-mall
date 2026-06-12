import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/password-reset-forms";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-4 py-10">
      <ForgotPasswordForm />
      <p className="mt-4 text-sm text-muted-foreground">
        Remembered it? <Link className="font-medium text-primary" href="/login">Log in</Link>
      </p>
    </main>
  );
}
