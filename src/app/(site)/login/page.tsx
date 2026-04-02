import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LoginForm } from "@/components/auth/login-form";

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export const metadata = {
  title: "Sign in",
  description: "Sign in to Lemo Fest with email magic link or Google.",
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="py-20">
      <Container>
        <div className="mx-auto max-w-lg rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Authentication</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8]">
            Sign in to the platform
          </h1>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Use a magic link for email access. Admin and staff accounts unlock the dashboard and
            scanner. Demo access buttons appear in local development for the seeded accounts.
          </p>
          <div className="mt-8">
            <LoginForm callbackUrl={callbackUrl ?? "/admin"} />
          </div>
          <p className="mt-6 text-sm text-white/55">
            Need an account?{" "}
            <Link href="/" className="text-[#91e4ff] transition hover:text-[#f8f4e8]">
              Back to the homepage
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
