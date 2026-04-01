# Lemo Fest

Production-ready Next.js ticketing and eCommerce platform for Lemo Fest.

## Stack

- Next.js App Router
- React 19
- Tailwind CSS
- PostgreSQL
- Prisma
- NextAuth / Auth.js
- PayGate integration
- Nodemailer email delivery
- Cloudinary-ready image storage
- QR code generation
- PWA support with service worker caching

## Build Order

1. Database schema
2. Backend actions, auth, payments, QR codes, and email
3. Frontend public site, store, admin, and scanner UI

## Setup

1. Copy `.env.example` to `.env.local` and fill in the secrets.
2. Install dependencies:

```bash
npm install
```

3. Push the Prisma schema to PostgreSQL:

```bash
npm run db:push
```

4. Seed the demo data:

```bash
npm run db:seed
```

5. Start the development server:

```bash
npm run dev
```

## Seed Accounts

- `admin@lemofest.co.za`
- `staff@lemofest.co.za`

## Key Routes

- `/` landing page
- `/events` events listing
- `/events/[slug]` event detail
- `/shop` merch store
- `/shop/[slug]` product detail
- `/gallery` gallery grid
- `/news` social/news feed
- `/checkout` cart checkout
- `/tickets/[code]` printable ticket
- `/verify` staff scanner PWA
- `/admin` dashboard

## Notes

- The checkout flow supports real PayGate credentials when `PAYGATE_ID` and `PAYGATE_ENCRYPTION_KEY` are set.
- Without payment credentials, the checkout page uses the demo confirmation route so the app still works locally.
- The scanner route is protected to `ADMIN` and `STAFF` roles.
- Facebook syncing falls back to the seeded demo posts when Graph API credentials are missing.

