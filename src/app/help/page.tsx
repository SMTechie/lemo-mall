import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata = { title: "Help Centre" };

const faqs = [
  ["Where do I find my tickets?", "Paid ticket orders generate QR tickets under your account order history and by email when SMTP is configured."],
  ["Can I buy merch and tickets together?", "Yes. The checkout supports mixed carts and confirms everything through a single Stripe payment."],
  ["What happens if a ticket is scanned twice?", "The scanner marks valid tickets as used. A second scan is rejected with the current ticket status."],
  ["How do promo codes work?", "Enter an active promo code at checkout. Admins can manage limits, expiry dates and pause codes."]
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Help centre</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal">Answers for customers and event teams</h1>
        </div>
        <Button asChild>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" />WhatsApp us</a>
        </Button>
      </div>
      <div className="mt-8 grid gap-4">
        {faqs.map(([question, answer]) => (
          <Card key={question}>
            <CardContent className="p-5">
              <h2 className="font-semibold">{question}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Still stuck? <Link className="font-medium text-primary" href="/contact">Send a support enquiry</Link>.
      </p>
    </main>
  );
}
