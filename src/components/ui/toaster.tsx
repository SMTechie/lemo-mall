"use client";

import * as Toast from "@radix-ui/react-toast";
import { createContext, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type ToastMessage = { id: string; title: string; description?: string };
type ToastContextValue = { toast: (message: Omit<ToastMessage, "id">) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const value = useMemo(
    () => ({
      toast(message: Omit<ToastMessage, "id">) {
        setMessages((current) => [...current, { id: crypto.randomUUID(), ...message }]);
      }
    }),
    []
  );

  return (
    <Toast.Provider swipeDirection="right">
      <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
      {messages.map((message) => (
        <Toast.Root
          key={message.id}
          className={cn("rounded-md border bg-card p-4 text-card-foreground shadow-lg")}
          onOpenChange={(open) => {
            if (!open) setMessages((current) => current.filter((entry) => entry.id !== message.id));
          }}
        >
          <Toast.Title className="text-sm font-semibold">{message.title}</Toast.Title>
          {message.description ? <Toast.Description className="mt-1 text-sm text-muted-foreground">{message.description}</Toast.Description> : null}
        </Toast.Root>
      ))}
      <Toast.Viewport className="fixed bottom-4 right-4 z-50 grid w-96 max-w-[calc(100vw-2rem)] gap-2" />
    </Toast.Provider>
  );
}
