"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { resolveImageUrl } from "@/lib/storage";
import {
  eventUpsertSchema,
  galleryUpsertSchema,
  productUpsertSchema,
  socialSyncSchema,
  testimonialUpsertSchema,
} from "@/lib/validators";
import { redirect } from "next/navigation";
import { demoSocialPosts } from "@/lib/demo-data";
import { verifyAndConsumeTicket } from "@/lib/tickets";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return session;
}

async function requirePrivileged() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "STAFF"].includes(session.user.role)) {
    redirect("/login");
  }

  return session;
}

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asBoolean(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return false;
  return value === "on" || value === "true" || value === "1";
}

function asNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function asFile(value: FormDataEntryValue | null) {
  return value instanceof File && value.size > 0 ? value : null;
}

export async function upsertEventAction(formData: FormData) {
  await requireAdmin();

  const imageUrl = await resolveImageUrl({
    file: asFile(formData.get("imageFile")),
    fallbackUrl: asString(formData.get("imageUrl")),
    folder: "events",
  });

  const parsed = eventUpsertSchema.parse({
    id: asString(formData.get("id")),
    title: asString(formData.get("title")),
    slug: asString(formData.get("slug")),
    description: asString(formData.get("description")),
    location: asString(formData.get("location")),
    venue: asString(formData.get("venue")),
    address: asString(formData.get("address")),
    startsAt: asString(formData.get("startsAt")),
    endsAt: asString(formData.get("endsAt")),
    ticketPriceCents: asNumber(formData.get("ticketPriceCents")),
    capacity: asNumber(formData.get("capacity")),
    imageUrl,
    galleryUrls: asString(formData.get("galleryUrls")),
    tags: asString(formData.get("tags")),
    featured: asBoolean(formData.get("featured")),
    published: asBoolean(formData.get("published")),
  });

  const { id, ...eventData } = parsed;

  if (id) {
    await prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        venue: eventData.venue ?? null,
        address: eventData.address ?? null,
        endsAt: eventData.endsAt ? new Date(eventData.endsAt) : null,
        startsAt: new Date(eventData.startsAt),
      },
    });
  } else {
    const session = await requireAdmin();
    await prisma.event.create({
      data: {
        ...eventData,
        venue: eventData.venue ?? null,
        address: eventData.address ?? null,
        endsAt: eventData.endsAt ? new Date(eventData.endsAt) : null,
        startsAt: new Date(eventData.startsAt),
        createdById: session.user.id,
      },
    });
  }

  redirect("/admin/events?success=1");
}

export async function deleteEventAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  if (!id) redirect("/admin/events?error=missing-id");

  await prisma.event.delete({ where: { id } });
  redirect("/admin/events?deleted=1");
}

export async function upsertProductAction(formData: FormData) {
  await requireAdmin();

  const imageUrl = await resolveImageUrl({
    file: asFile(formData.get("imageFile")),
    fallbackUrl: asString(formData.get("imageUrl")),
    folder: "products",
  });

  const parsed = productUpsertSchema.parse({
    id: asString(formData.get("id")),
    name: asString(formData.get("name")),
    slug: asString(formData.get("slug")),
    description: asString(formData.get("description")),
    category: asString(formData.get("category")),
    priceCents: asNumber(formData.get("priceCents")),
    compareAtPriceCents: asNumber(formData.get("compareAtPriceCents")),
    inventory: asNumber(formData.get("inventory")),
    imageUrl,
    galleryUrls: asString(formData.get("galleryUrls")),
    featured: asBoolean(formData.get("featured")),
    active: asBoolean(formData.get("active")),
  });

  const { id, ...productData } = parsed;

  if (id) {
    await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        compareAtPriceCents: productData.compareAtPriceCents ?? null,
      },
    });
  } else {
    await prisma.product.create({
      data: {
        ...productData,
        compareAtPriceCents: productData.compareAtPriceCents ?? null,
      },
    });
  }

  redirect("/admin/products?success=1");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  if (!id) redirect("/admin/products?error=missing-id");

  await prisma.product.delete({ where: { id } });
  redirect("/admin/products?deleted=1");
}

export async function upsertGalleryAction(formData: FormData) {
  await requireAdmin();

  const imageUrl = await resolveImageUrl({
    file: asFile(formData.get("imageFile")),
    fallbackUrl: asString(formData.get("imageUrl")),
    folder: "gallery",
  });

  const parsed = galleryUpsertSchema.parse({
    id: asString(formData.get("id")),
    title: asString(formData.get("title")),
    slug: asString(formData.get("slug")),
    description: asString(formData.get("description")),
    imageUrl,
    downloadUrl: asString(formData.get("downloadUrl")),
    altText: asString(formData.get("altText")),
    eventId: asString(formData.get("eventId")),
    featured: asBoolean(formData.get("featured")),
    published: asBoolean(formData.get("published")),
  });

  const { id, ...galleryData } = parsed;

  if (id) {
    await prisma.galleryImage.update({
      where: { id },
      data: {
        ...galleryData,
        description: galleryData.description ?? null,
        downloadUrl: galleryData.downloadUrl ?? null,
        altText: galleryData.altText ?? null,
        eventId: galleryData.eventId ?? null,
      },
    });
  } else {
    await prisma.galleryImage.create({
      data: {
        ...galleryData,
        description: galleryData.description ?? null,
        downloadUrl: galleryData.downloadUrl ?? null,
        altText: galleryData.altText ?? null,
        eventId: galleryData.eventId ?? null,
      },
    });
  }

  redirect("/admin/gallery?success=1");
}

export async function deleteGalleryAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  if (!id) redirect("/admin/gallery?error=missing-id");

  await prisma.galleryImage.delete({ where: { id } });
  redirect("/admin/gallery?deleted=1");
}

export async function upsertTestimonialAction(formData: FormData) {
  await requireAdmin();

  const avatarUrl = await resolveImageUrl({
    file: asFile(formData.get("avatarFile")),
    fallbackUrl: asString(formData.get("avatarUrl")),
    folder: "testimonials",
  });

  const parsed = testimonialUpsertSchema.parse({
    id: asString(formData.get("id")),
    name: asString(formData.get("name")),
    role: asString(formData.get("role")),
    quote: asString(formData.get("quote")),
    avatarUrl,
    rating: asNumber(formData.get("rating")),
    featured: asBoolean(formData.get("featured")),
    published: asBoolean(formData.get("published")),
  });

  const { id, ...testimonialData } = parsed;

  if (id) {
    await prisma.testimonial.update({
      where: { id },
      data: {
        ...testimonialData,
        role: testimonialData.role ?? null,
        avatarUrl: testimonialData.avatarUrl ?? null,
      },
    });
  } else {
    await prisma.testimonial.create({
      data: {
        ...testimonialData,
        role: testimonialData.role ?? null,
        avatarUrl: testimonialData.avatarUrl ?? null,
      },
    });
  }

  redirect("/admin/testimonials?success=1");
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  if (!id) redirect("/admin/testimonials?error=missing-id");

  await prisma.testimonial.delete({ where: { id } });
  redirect("/admin/testimonials?deleted=1");
}

export async function syncSocialPostsAction(formData: FormData) {
  await requireAdmin();
  socialSyncSchema.parse({ source: asString(formData.get("source")) ?? "FACEBOOK" });

  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_ACCESS_TOKEN;

  const posts =
    pageId && token
      ? await (async () => {
          try {
            const response = await fetch(
              `https://graph.facebook.com/v19.0/${pageId}/posts?fields=message,created_time,permalink_url,full_picture,from&limit=6&access_token=${token}`,
              {
                cache: "no-store",
              },
            );
            if (!response.ok) {
              throw new Error("Facebook sync failed");
            }

            const json = (await response.json()) as {
              data?: Array<{
                id: string;
                message?: string;
                created_time?: string;
                permalink_url?: string;
                full_picture?: string;
                from?: { name?: string };
              }>;
            };

            return (
              json.data?.map((entry) => ({
                externalId: entry.id,
                source: "FACEBOOK",
                message: entry.message ?? "New Facebook post",
                link: entry.permalink_url ?? null,
                imageUrl: entry.full_picture ?? null,
                authorName: entry.from?.name ?? "Lemo Fest",
                publishedAt: entry.created_time ? new Date(entry.created_time) : new Date(),
                featured: true,
              })) ?? demoSocialPosts
            );
          } catch {
            return demoSocialPosts;
          }
        })()
      : demoSocialPosts;

  for (const post of posts) {
    await prisma.socialPost.upsert({
      where: { externalId: post.externalId },
      update: {
        message: post.message,
        link: post.link,
        imageUrl: post.imageUrl,
        authorName: post.authorName,
        publishedAt: new Date(post.publishedAt),
        featured: post.featured,
      },
      create: {
        externalId: post.externalId,
        source: "FACEBOOK",
        message: post.message,
        link: post.link,
        imageUrl: post.imageUrl,
        authorName: post.authorName,
        publishedAt: new Date(post.publishedAt),
        featured: post.featured,
      },
    });
  }

  redirect("/admin/social?synced=1");
}

export async function upsertTicketStatusAction(formData: FormData) {
  await requirePrivileged();
  const code = asString(formData.get("code"));
  const status = asString(formData.get("status"));

  if (!code || !status) {
    redirect("/admin/tickets?error=missing-data");
  }

  await prisma.ticket.update({
    where: { code },
    data: {
      status: status as "VALID" | "USED" | "VOID",
      usedAt: status === "USED" ? new Date() : null,
    },
  });

  redirect("/admin/tickets?updated=1");
}

export async function verifyTicketNowAction(formData: FormData) {
  await requirePrivileged();
  const code = asString(formData.get("code"));

  if (!code) {
    redirect("/admin/tickets?error=missing-code");
  }

  const result = await verifyAndConsumeTicket({ code, scannerUserId: (await auth())?.user?.id });

  redirect(
    `/admin/tickets?verified=${result.valid ? "1" : "0"}&code=${encodeURIComponent(code)}`,
  );
}

export async function fulfillOrderAction(formData: FormData) {
  await requireAdmin();
  const orderNumber = asString(formData.get("orderNumber"));
  if (!orderNumber) redirect("/admin/orders?error=missing-order");

  await prisma.order.update({
    where: { orderNumber },
    data: {
      status: "FULFILLED",
      fulfilledAt: new Date(),
    },
  });

  redirect("/admin/orders?fulfilled=1");
}
