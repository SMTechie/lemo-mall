export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-normal">Privacy policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>We collect account, order, ticket and support information to provide purchases, ticket delivery, customer support and fraud prevention.</p>
        <p>Payments are processed by Stripe. We do not store card numbers. Event entry may require ticket status checks through QR scanning.</p>
        <p>Customer information is only used for platform operations, reporting, support and legally required records.</p>
        <p>Contact support to request correction or deletion of eligible personal information.</p>
      </div>
    </main>
  );
}
