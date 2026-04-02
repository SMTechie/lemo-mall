"use client";

import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type InfoDialogProps = {
  triggerLabel: string;
  title: string;
  description: string;
  children: ReactNode;
  triggerClassName?: string;
};

export function InfoDialog({
  triggerLabel,
  title,
  description,
  children,
  triggerClassName,
}: InfoDialogProps) {
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
          "inline-flex h-11 items-center justify-center rounded-full bg-[#7f9a65] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(127,154,101,0.24)] transition hover:bg-[#6f8858]",
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
            aria-labelledby="info-dialog-title"
            className="w-full max-w-xl rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_30px_80px_rgba(15,35,18,0.18)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#80916f]">Popup</p>
                <h3 id="info-dialog-title" className="mt-2 text-2xl font-semibold text-[#132414]">
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

            <div className="mt-6 rounded-[24px] border border-[#dce5cf] bg-[#f7f9f3] p-5 text-sm leading-7 text-[#5e6c5a]">
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
