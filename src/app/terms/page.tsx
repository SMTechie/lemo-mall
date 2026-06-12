export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-normal">Terms of service</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>By using Lemo Fest, customers agree to provide accurate checkout and ticket holder information.</p>
        <p>Tickets are issued as unique QR codes and may be used once unless the event organiser states otherwise.</p>
        <p>Merchandise availability is subject to live stock levels. Orders are confirmed only after payment is received.</p>
        <p>Admins are responsible for event accuracy, ticket quantities, product details and fulfilment policies.</p>
      </div>
    </main>
  );
}
