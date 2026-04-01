"use client";

import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-white/6 p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur">
        <Image
          src="/lemofest/dugem-logos.png"
          alt="Lemo Fest"
          width={180}
          height={60}
          className="mx-auto h-10 w-auto object-contain"
        />
        <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Something slipped</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#f8f4e8]">We hit an unexpected error</h1>
        <p className="mt-3 text-sm leading-7 text-white/70">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition hover:brightness-95"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
