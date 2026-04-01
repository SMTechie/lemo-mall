import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-2xl border border-white/10 bg-[#10172d]/90 px-4 py-3 text-sm text-[#f8f4e8] outline-none placeholder:text-white/35 focus:border-[#ff8f5c] focus:ring-2 focus:ring-[#ff8f5c]/20",
        className,
      )}
      {...props}
    />
  );
}

