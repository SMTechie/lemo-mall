import { z } from "zod";

const csvToArray = z
  .string()
  .optional()
  .transform((value) =>
    value
      ? value
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)
      : [],
  );

const nullableString = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  });

const enquiryTypeSchema = z.enum([
  "GENERAL",
  "TICKETS",
  "MERCH",
  "EVENT_BOOKING",
  "SPONSORSHIP",
  "SUPPORT",
]);

export const ticketCartItemSchema = z.object({
  kind: z.enum(["TICKET", "PRODUCT"]),
  id: z.string().min(1),
  name: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  unitPriceCents: z.coerce.number().int().nonnegative(),
  eventId: z.string().optional(),
  productId: z.string().optional(),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Enter a valid email"),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  discountCode: z.string().optional(),
  shippingAddressLine1: nullableString,
  shippingAddressLine2: nullableString,
  shippingCity: nullableString,
  shippingRegion: nullableString,
  shippingPostalCode: nullableString,
  shippingCountry: nullableString,
  items: z.array(ticketCartItemSchema).min(1, "Cart is empty"),
});

export const ticketVerificationSchema = z.object({
  code: z.string().min(4, "Scan a valid ticket code"),
});

export const eventUpsertSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(20),
  location: z.string().min(2),
  venue: nullableString,
  address: nullableString,
  startsAt: z.string().min(1),
  endsAt: z.string().min(1).optional(),
  ticketPriceCents: z.coerce.number().int().nonnegative(),
  capacity: z.coerce.number().int().positive().optional(),
  imageUrl: z.string().min(2),
  galleryUrls: csvToArray,
  tags: csvToArray,
  featured: z.coerce.boolean().optional().default(false),
  published: z.coerce.boolean().optional().default(true),
});

export const productUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(20),
  category: z.string().min(2),
  priceCents: z.coerce.number().int().nonnegative(),
  compareAtPriceCents: z.coerce.number().int().nonnegative().optional(),
  inventory: z.coerce.number().int().nonnegative(),
  imageUrl: z.string().min(2),
  galleryUrls: csvToArray,
  featured: z.coerce.boolean().optional().default(false),
  active: z.coerce.boolean().optional().default(true),
});

export const testimonialUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  role: nullableString,
  quote: z.string().min(10),
  avatarUrl: nullableString,
  rating: z.coerce.number().int().min(1).max(5),
  featured: z.coerce.boolean().optional().default(false),
  published: z.coerce.boolean().optional().default(true),
});

export const galleryUpsertSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(2),
  description: nullableString,
  imageUrl: z.string().min(2),
  downloadUrl: nullableString,
  altText: nullableString,
  eventId: nullableString,
  featured: z.coerce.boolean().optional().default(false),
  published: z.coerce.boolean().optional().default(true),
});

export const discountCodeSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(2),
  description: nullableString,
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().int().positive(),
  active: z.coerce.boolean().optional().default(true),
  usageLimit: z.coerce.number().int().positive().optional(),
  expiresAt: z.string().min(1).optional(),
});

export const socialSyncSchema = z.object({
  source: z.enum(["FACEBOOK", "INSTAGRAM", "MANUAL"]).default("FACEBOOK"),
});

export const enquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: nullableString,
  type: enquiryTypeSchema.default("GENERAL"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Write a little more detail"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type EventUpsertInput = z.infer<typeof eventUpsertSchema>;
export type ProductUpsertInput = z.infer<typeof productUpsertSchema>;
export type TestimonialUpsertInput = z.infer<typeof testimonialUpsertSchema>;
export type GalleryUpsertInput = z.infer<typeof galleryUpsertSchema>;
export type DiscountCodeInput = z.infer<typeof discountCodeSchema>;
export type EnquiryInput = z.infer<typeof enquirySchema>;
