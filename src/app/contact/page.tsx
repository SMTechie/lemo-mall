import { MapPin, MessageCircle, ShieldCheck, TicketCheck } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { visitorInfo } from "@/lib/lemofest";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main>
      <section className="border-b bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary">Contact and visit</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal">Talk to the Lemo Fest team</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Get help with orders, ticket delivery, refunds, event access, visitor planning, vendor enquiries or platform operations.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <Card>
            <CardHeader><CardTitle>Send an enquiry</CardTitle></CardHeader>
            <CardContent><ContactForm /></CardContent>
          </Card>

          <div className="mt-8">
            <div className="mb-4">
              <p className="text-sm font-semibold text-primary">Visitor information</p>
              <h2 className="mt-1 text-2xl font-bold tracking-normal">Plan your Lemo Fest visit</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {visitorInfo.map(([title, copy]) => (
                <Card key={title}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <MessageCircle className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-semibold">WhatsApp support</h2>
              <p className="mt-2 text-sm text-muted-foreground">Fastest for order checks, ticket delivery questions and gate support.</p>
              <Button asChild className="mt-4 w-full">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer">Open WhatsApp</a>
              </Button>
            </CardContent>
          </Card>
          {[
            ["Main venue", MapPin, "Lemo Green Park hosts the core festival programme."],
            ["Secure payments", ShieldCheck, "Stripe-powered checkout in ZAR with webhook confirmation."],
            ["Ticket support", TicketCheck, "QR tickets can be resent and verified by the admin scanner."]
          ].map(([title, Icon, copy]) => (
            <Card key={String(title)}>
              <CardContent className="p-5">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-semibold">{String(title)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{String(copy)}</p>
              </CardContent>
            </Card>
          ))}
        </aside>
      </section>
    </main>
  );
}
