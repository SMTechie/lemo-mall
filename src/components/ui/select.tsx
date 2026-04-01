import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-white/10 bg-[#10172d]/90 px-4 text-sm text-[#f8f4e8] outline-none focus:border-[#ff8f5c] focus:ring-2 focus:ring-[#ff8f5c]/20",
        className,
      )}
      {...props}
    />
  );
}

