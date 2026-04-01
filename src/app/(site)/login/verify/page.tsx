import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Check your inbox",
  description: "Email verification link sent for Lemo Fest sign in.",
};

export default function VerifyRequestPage() {
  return (
    <div className="py-20">
      <Container>
        <div className="mx-auto max-w-lg rounded-[32px] border border-white/10 bg-white/6 p-8 text-center backdrop-blur">
          <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Email sent</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8]">
            Check your inbox
          </h1>
          <p className="mt-3 text-sm leading-7 text-white/70">
            We sent a sign-in link to your email address. Follow the link to continue into the
            platform.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center rounded-full bg-gradient-to-r from-[#ff8f5c] via-[#ff6b4a] to-[#ffcc66] px-5 text-sm font-semibold text-[#0b1020]"
          >
            Back home
          </Link>
        </div>
      </Container>
    </div>
  );
}

