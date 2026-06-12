import Link from "next/link";
import { CreditCard, MessageCircle } from "lucide-react";
import { refundSteps } from "@/lib/lemofest";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Bar Card Refunds",
  description: "How Lemo Fest patrons can request a bar-card balance refund."
};

export default function BarCardRefundsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold text-primary">Refund support</p>
        <h1 className="mt-2 text-4xl font-bold tracking-normal">Bar-card balance refunds</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          If you still have cash on your Lemo Fest bar card, you can request a refund or keep the balance for an upcoming Lemo Fest event.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardContent className="p-6">
            <CreditCard className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">How to request a refund</h2>
            <div className="mt-5 grid gap-4">
              {refundSteps.map((step, index) => (
                <div key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">{index + 1}</span>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
            <Button asChild className="mt-6">
              <a href="https://widget.weezevent.com/" target="_blank" rel="noreferrer">Open refund page</a>
            </Button>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold">Keeping your balance?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Remaining funds can stay valid for a future Lemo Fest event if you prefer to roll them into the next festival.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="mt-3 font-semibold">Need help?</h2>
              <p className="mt-2 text-sm text-muted-foreground">Message support with your order details and bar-card question.</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer">WhatsApp support</a>
              </Button>
            </CardContent>
          </Card>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/help">Read help centre</Link>
          </Button>
        </aside>
      </div>
    </main>
  );
}
