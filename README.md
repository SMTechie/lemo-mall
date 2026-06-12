# Lemo Mall

Production-oriented SaaS storefront for selling merchandise and event tickets with Next.js App Router, Auth.js, Prisma, Neon, Stripe, Cloudinary and QR ticket scanning.

## Stack

- Next.js 16 App Router, TypeScript, Tailwind CSS, ShadCN-style UI primitives and Framer Motion dependency
- Server Actions and Route Handlers only, optimized for Vercel serverless
- Neon PostgreSQL with Prisma driver adapter and pooled `DATABASE_URL`
- Auth.js credentials auth with bcrypt password hashing and admin/customer roles
- Stripe Checkout in ZAR with signed webhook verification
- Cloudinary signed upload helper
- QR ticket generation and browser-camera scanner
- Recharts admin analytics and CSV export
- WhatsApp support links, enquiry inbox, help centre and policy pages

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill values.

3. Create a Neon project:

- Open Neon and create a PostgreSQL database.
- Copy the pooled connection string. It usually contains `-pooler` in the host.
- Set `DATABASE_URL` to that pooled URL with `sslmode=require`.

4. Push the schema and seed starter data:

```bash
npm run db:push
npm run db:seed
```

Seeded users:

- Admin: `admin@lemomall.co.za` / `Admin123!`
- Customer: `customer@lemomall.co.za` / `Customer123!`

5. Run the app:

```bash
npm run dev
```

## Stripe Setup

1. Create or open a Stripe account.
2. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env`.
3. For local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Copy the generated `whsec_...` value to `STRIPE_WEBHOOK_SECRET`.

Required webhook events:

- `checkout.session.completed`
- `checkout.session.expired`
- `checkout.session.async_payment_failed`

The checkout uses ZAR line items. The Stripe Checkout Session creates the underlying PaymentIntent, and the webhook stores `stripePaymentIntentId` when payment completes.

## Cloudinary Setup

1. Create a Cloudinary account.
2. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
3. Admin-only signed upload credentials are available at `/api/cloudinary/sign` for integrating an upload widget or custom uploader.

## Vercel Deployment

1. Import the GitHub repo into Vercel.
2. Add all variables from `.env.example` in Vercel Project Settings.
3. Use the Neon pooled connection string for `DATABASE_URL`.
4. Set Stripe webhook endpoint to:

```text
https://your-domain.vercel.app/api/stripe/webhook
```

5. Run `npm run db:push` against production from a trusted machine or CI step.
6. Deploy. The app avoids traditional servers and uses Vercel-compatible Route Handlers and Server Actions.

## Important Routes

- `/shop` and `/shop/[slug]` merchandise storefront
- `/events` and `/events/[slug]` event ticketing
- `/checkout` unified merch and ticket checkout
- `/account/orders` customer order history
- `/tickets/[code]` QR ticket display
- `/contact` support enquiries and WhatsApp escalation
- `/help`, `/privacy`, `/terms`, `/refunds`
- `/admin` dashboard with metrics and charts
- `/admin/products`, `/admin/events`, `/admin/orders`, `/admin/users`
- `/admin/discounts` promo-code management
- `/admin/support` customer support inbox
- `/admin/scanner` browser-camera QR check-in scanner
- `/api/stripe/webhook` signed Stripe webhook

## WhatsApp Support

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the business number in international format without `+`.

```text
27821234567
```

The storefront uses this for the floating WhatsApp button, footer, contact page and help centre.

## Security Notes

- Passwords are hashed with bcrypt.
- Admin routes are protected by JWT role checks in middleware.
- Server writes validate input with Zod.
- Stripe webhook signatures are mandatory.
- Product stock and ticket capacity are reserved atomically before Stripe redirect to prevent overselling.
- Pending inventory is released on Stripe expiration or async payment failure.
- Scanner API includes basic in-memory rate limiting suitable for serverless burst protection.
