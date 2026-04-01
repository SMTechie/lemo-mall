import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Badge } from "./badge";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "mb-8 flex items-end justify-between gap-6 animate-fade-up motion-reduce:animate-none",
        className,
      )}
    >
      <div className="max-w-2xl space-y-4">
        {eyebrow ? <Badge>{eyebrow}</Badge> : null}
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-[#f8f4e8] sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="text-sm leading-7 text-white/70 sm:text-base">{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
