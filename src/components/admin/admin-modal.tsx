import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminModal({
  children,
  closeHref,
  description,
  title
}: {
  children: React.ReactNode;
  closeHref: string;
  description?: string;
  title: string;
}) {
  const titleId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-title`;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/70 px-4 py-6 backdrop-blur-sm sm:py-10">
      <Link href={closeHref} className="fixed inset-0" aria-label={`Close ${title}`} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-lg border bg-background shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold tracking-normal">{title}</h2>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href={closeHref}><X className="h-4 w-4" />Close</Link>
          </Button>
        </div>
        <div className="max-h-[calc(100vh-11rem)] overflow-y-auto px-5 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
