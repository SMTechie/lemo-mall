import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-4 py-10">
      <AuthForm mode="register" />
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account? <Link className="font-medium text-primary" href="/login">Log in</Link>
      </p>
    </main>
  );
}
