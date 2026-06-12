export const metadata = { title: "Refund Policy" };

export default function RefundsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-normal">Refund policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>Refund eligibility depends on the organiser, event timing, product condition and payment status.</p>
        <p>Unused tickets may be reviewed for refund before the event starts. Used, scanned or expired tickets are generally not refundable.</p>
        <p>Merchandise refunds require proof of purchase and may require return inspection before approval.</p>
        <p>Use the contact page or WhatsApp support for refund requests with your order number.</p>
      </div>
    </main>
  );
}
