"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmActionDialogProps = {
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel?: string;
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string>;
  triggerClassName?: string;
  confirmClassName?: string;
};

export function ConfirmActionDialog({
  triggerLabel,
  title,
  description,
  confirmLabel = "Confirm",
  action,
  fields,
  triggerClassName,
  confirmClassName,
}: ConfirmActionDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "rounded-full border border-[#ff6b4a]/30 bg-[#ff6b4a]/10 px-3 py-2 text-xs text-[#a65b50] transition hover:bg-[#ff6b4a]/15",
          triggerClassName,
        )}
      >
        {triggerLabel}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="w-full max-w-lg rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_30px_80px_rgba(15,35,18,0.18)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#80916f]">Confirmation</p>
                <h3 id="confirm-dialog-title" className="mt-2 text-2xl font-semibold text-[#132414]">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7decf] bg-[#f7f9f3] text-[#5e6c5a] transition hover:bg-[#eef3e7]"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-7 text-[#5e6c5a]">{description}</p>

            <form
              action={action}
              className="mt-6 space-y-4"
              onSubmit={() => setOpen(false)}
            >
              {Object.entries(fields).map(([name, value]) => (
                <input key={name} type="hidden" name={name} value={value} />
              ))}
              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 items-center rounded-full border border-[#d7decf] bg-[#f7f9f3] px-5 text-sm font-medium text-[#132414] transition hover:bg-[#eef3e7]"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="secondary"
                  className={cn("bg-[#ff6b4a] text-white hover:bg-[#e85c3d]", confirmClassName)}
                >
                  {confirmLabel}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
