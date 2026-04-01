import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  image: string;
  alt: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function BackdropPanel({
  image,
  alt,
  children,
  className,
  contentClassName,
}: Props) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-white/6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur",
        className,
      )}
    >
      <div className="absolute inset-0 -z-20">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover object-center animate-slow-zoom motion-reduce:animate-none"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,10,10,0.18),rgba(10,10,10,0.82))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,204,102,0.16),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,44,85,0.14),transparent_38%)]" />
      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </section>
  );
}
