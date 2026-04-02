import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-[#d7decf] bg-white px-4 text-sm text-[#132414] outline-none shadow-[0_12px_28px_rgba(15,35,18,0.03)] focus:border-[#7f9a65] focus:ring-2 focus:ring-[#7f9a65]/15",
        className,
      )}
      {...props}
    />
  );
}
