# Lemo Mall

Production-oriented SaaS storefront for selling merchandise and event tickets with Next.js App Router, Auth.js, Prisma, Neon, Yoco, Resend and QR ticket scanning.

## Stack

- Next.js 16 App Router, TypeScript, Tailwind CSS, ShadCN-style UI primitives and Framer Motion dependency
- Server Actions and Route Handlers only, optimized for Vercel serverless
- Neon PostgreSQL with Prisma driver adapter and pooled `DATABASE_URL`
- Auth.js credentials auth with bcrypt password hashing and admin/customer roles
- Yoco Checkout in ZAR with return-page and webhook payment confirmation
- Neon-backed admin image uploads
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

## Yoco Setup

1. Use the official Yoco test keys already shown in `.env.example`, or replace them with your own Yoco keys.
2. The app creates hosted Yoco checkouts in ZAR and redirects customers to Yoco to pay.
3. For card testing, Yoco documents `4111 1111 1111 1111` with any future expiry date and any 3-digit CVC.
4. After deploying, register a Yoco webhook that points to:

```text
https://your-domain.vercel.app/api/yoco/webhook
```

The checkout success page also verifies the checkout status with Yoco, so local testing works even before a public webhook URL exists.

## Image Uploads

Admin product and event images are uploaded through `/api/admin/images` and stored in Neon/PostgreSQL as `ImageAsset` records. No Cloudinary keys are required.

## Resend Email Setup

1. Add `RESEND_API_KEY` to `.env` and Vercel Project Settings.
2. Use `RESEND_FROM="Lemo Mall <onboarding@resend.dev>"` for Resend's default sender, or replace it after verifying a custom domain.
3. Order confirmations and password reset emails are sent through Resend.

## Vercel Deployment

1. Import the GitHub repo into Vercel.
2. Add all variables from `.env.example` in Vercel Project Settings.
3. Use the Neon pooled connection string for `DATABASE_URL`.
4. Make sure `NEXT_PUBLIC_APP_URL`, `AUTH_URL` and `NEXTAUTH_URL` are not set to `http://localhost:3000` in Vercel. Use your live `https://...` domain, or leave `AUTH_URL`/`NEXTAUTH_URL` unset.
5. Register the Yoco webhook endpoint:

```text
https://your-domain.vercel.app/api/yoco/webhook
```

6. Run `npm run db:push` against production from a trusted machine or CI step.
7. Deploy. The app avoids traditional servers and uses Vercel-compatible Route Handlers and Server Actions.

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
- `/api/yoco/webhook` Yoco payment confirmation webhook

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
- Product stock and ticket capacity are reserved atomically before Yoco redirect to prevent overselling.
- Yoco payment webhooks re-check the checkout status server-side before creating tickets.
- Scanner API includes basic in-memory rate limiting suitable for serverless burst protection.
