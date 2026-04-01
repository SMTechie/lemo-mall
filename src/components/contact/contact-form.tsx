"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { submitEnquiryAction } from "@/actions/enquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EnquiryState = {
  error?: string;
  success?: boolean;
};

const enquiryTypes = [
  { value: "GENERAL", label: "General" },
  { value: "TICKETS", label: "Tickets" },
  { value: "MERCH", label: "Merchandise" },
  { value: "EVENT_BOOKING", label: "Event booking" },
  { value: "SPONSORSHIP", label: "Sponsorship" },
  { value: "SUPPORT", label: "Support" },
];

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<EnquiryState, FormData>(
    submitEnquiryAction,
    {},
  );

  return (
    <form
      action={formAction}
      className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70" htmlFor="name">
            Full name
          </label>
          <Input id="name" name="name" placeholder="Your name" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70" htmlFor="email">
            Email address
          </label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70" htmlFor="phone">
            Phone number
          </label>
          <Input id="phone" name="phone" type="tel" placeholder="+27 82 555 0101" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70" htmlFor="type">
            Enquiry type
          </label>
          <select
            id="type"
            name="type"
            defaultValue="GENERAL"
            className="h-11 w-full rounded-full border border-white/10 bg-[#0b1020]/60 px-4 text-sm text-[#f8f4e8] outline-none transition focus:border-[#ffcc66]"
          >
            {enquiryTypes.map((item) => (
              <option key={item.value} value={item.value} className="bg-[#0b1020]">
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium text-white/70" htmlFor="subject">
            Subject
          </label>
          <Input id="subject" name="subject" placeholder="How can we help?" required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium text-white/70" htmlFor="message">
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us what you need, who it is for, and when you need a reply."
            required
            className="min-h-40"
          />
        </div>
      </div>

      {state.error ? (
        <div className="mt-5 rounded-[24px] border border-[#ff6b4a]/30 bg-[#ff6b4a]/10 px-4 py-3 text-sm text-[#ffd7cf]">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="mt-5 rounded-[24px] border border-[#ffff00]/30 bg-[#ffff00]/10 px-4 py-3 text-sm text-[#fff8bf]">
          Thanks. Your enquiry has been received and the team will review it shortly.
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm leading-7 text-white/60">
          For urgent issues, email hello@lemofest.co.za or use the footer links.
        </p>
        <Button type="submit" disabled={isPending}>
          <Send className="h-4 w-4" />
          {isPending ? "Sending..." : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
