import { z } from "zod";
import { isStoredImagePath } from "@/lib/images";

export const emailSchema = z.string().email().toLowerCase();
export const passwordSchema = z.string().min(8).max(128);

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: emailSchema,
  password: passwordSchema
});

export const adminCreateUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: emailSchema,
  phone: z.string().trim().max(40).optional(),
  password: passwordSchema,
  roleId: z.string().trim().optional().or(z.literal("").transform(() => undefined))
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32),
  password: passwordSchema,
  confirmPassword: passwordSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const profileSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().trim().max(40).optional(),
  image: z.string().trim().url().optional().or(z.literal("").transform(() => undefined))
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
  confirmPassword: passwordSchema
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const imageReferenceSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => isStoredImagePath(value) || z.string().url().safeParse(value).success, "Enter a valid stored image or image URL.");

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  priceCents: z.coerce.number().int().min(100),
  stock: z.coerce.number().int().min(0),
  category: z.string().min(2).max(80),
  images: imageReferenceSchema.array().min(1),
  featured: z.coerce.boolean().default(false),
  active: z.coerce.boolean().default(true)
});

export const ticketTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(80),
  description: z.string().max(400).optional(),
  priceCents: z.coerce.number().int().min(0),
  quantity: z.coerce.number().int().min(1),
  active: z.coerce.boolean().default(true)
});

export const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2).max(160),
  description: z.string().min(20).max(4000),
  startsAt: z.coerce.date(),
  location: z.string().min(2).max(200),
  bannerImage: imageReferenceSchema,
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
  ticketTypes: ticketTypeSchema.array().min(1)
});

export const cartItemSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("product"),
    productId: z.string(),
    quantity: z.number().int().min(1).max(20)
  }),
  z.object({
    kind: z.literal("ticket"),
    ticketTypeId: z.string(),
    quantity: z.number().int().min(1).max(10)
  })
]);

export const checkoutSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: emailSchema,
  discountCode: z.string().trim().max(40).optional(),
  items: cartItemSchema.array().min(1).max(50)
});

export const scanSchema = z.object({
  payload: z.string().min(10).max(400)
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: emailSchema,
  phone: z.string().trim().max(40).optional(),
  subject: z.string().min(3).max(140),
  message: z.string().min(10).max(2000)
});

export const discountSchema = z.object({
  code: z.string().trim().min(3).max(40).transform((value) => value.toUpperCase()),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().int().min(1),
  usageLimit: z.coerce.number().int().min(1).optional().or(z.literal("").transform(() => undefined)),
  active: z.coerce.boolean().default(true),
  expiresAt: z.coerce.date().optional().or(z.literal("").transform(() => undefined))
});

export const pricingRuleSchema = z.object({
  type: z.enum(["EARLY_BIRD", "INVENTORY_TIER", "LIMITED_TIME"]),
  name: z.string().min(2).max(120),
  eventId: z.string().optional(),
  ticketTypeId: z.string().optional(),
  startsAt: z.coerce.date().optional().or(z.literal("").transform(() => undefined)),
  endsAt: z.coerce.date().optional().or(z.literal("").transform(() => undefined)),
  threshold: z.coerce.number().int().min(0).optional().or(z.literal("").transform(() => undefined)),
  priceCents: z.coerce.number().int().min(0).optional().or(z.literal("").transform(() => undefined)),
  discountBps: z.coerce.number().int().min(0).max(10000).optional().or(z.literal("").transform(() => undefined)),
  active: z.coerce.boolean().default(true)
});

export const reviewSchema = z.object({
  productId: z.string().optional(),
  eventId: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional()
});

export const refundSchema = z.object({
  orderId: z.string(),
  reason: z.string().min(10).max(1500)
});

export const campaignSchema = z.object({
  name: z.string().min(2).max(120),
  subject: z.string().min(3).max(160),
  body: z.string().min(10).max(5000),
  audience: z.enum(["ALL_USERS", "EVENT_ATTENDEES", "HIGH_VALUE_CUSTOMERS", "VIP_CUSTOMERS"])
});

export const roleBuilderSchema = z.object({
  name: z.string().trim().min(2).max(60).transform((value) => value.toUpperCase().replace(/[^A-Z0-9_]+/g, "_")),
  description: z.string().trim().max(300).optional()
});

export const tenantSettingsSchema = z.object({
  name: z.string().trim().min(2).max(120),
  supportEmail: emailSchema.optional().or(z.literal("").transform(() => undefined)),
  whatsappNumber: z.string().trim().max(30).regex(/^\d+$/, "Use digits only").optional().or(z.literal("").transform(() => undefined)),
  platformFeeBps: z.coerce.number().int().min(0).max(3000),
  fixedTicketFeeCents: z.coerce.number().int().min(0).max(100000)
});
