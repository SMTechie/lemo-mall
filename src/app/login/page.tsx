import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-4 py-10">
      <AuthForm mode="login" />
      <p className="mt-4 text-sm text-muted-foreground">
        New here? <Link className="font-medium text-primary" href="/register">Create an account</Link>
      </p>
    </main>
  );
}
