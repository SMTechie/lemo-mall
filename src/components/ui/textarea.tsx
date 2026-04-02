import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-2xl border border-[#d7decf] bg-white px-4 py-3 text-sm text-[#132414] outline-none placeholder:text-[#97a491] shadow-[0_12px_28px_rgba(15,35,18,0.03)] focus:border-[#7f9a65] focus:ring-2 focus:ring-[#7f9a65]/15",
        className,
      )}
      {...props}
    />
  );
}
