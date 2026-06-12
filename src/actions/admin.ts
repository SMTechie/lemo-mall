"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logActivity, requirePermission } from "@/lib/permissions";
import { campaignSchema, discountSchema, eventSchema, pricingRuleSchema, productSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function saveProductAction(formData: FormData) {
  await requirePermission("manage_products");
  const images = formData
    .getAll("images")
    .flatMap((value) => String(value).split("\n"))
    .map((v) => v.trim())
    .filter(Boolean);
  const parsed = productSchema.safeParse({
    ...Object.fromEntries(formData),
    images,
    featured: formData.get("featured") === "on",
    active: formData.get("active") !== "off"
  });

  if (!parsed.success) throw new Error("Invalid product data");
  const { id, ...data } = parsed.data;
  const slug = slugify(data.name);

  if (id) {
    await prisma.product.update({ where: { id }, data: { ...data, slug } });
  } else {
    await prisma.product.create({ data: { ...data, slug } });
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  await logActivity({ action: id ? "product.updated" : "product.created", entityType: "Product", entityId: id });
  redirect("/admin/products");
}

export async function deleteProductAction(id: string) {
  await requirePermission("manage_products");
  await prisma.product.update({ where: { id }, data: { active: false } });
  await logActivity({ action: "product.hidden", entityType: "Product", entityId: id });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function saveEventAction(formData: FormData) {
  await requirePermission("manage_events");
  const names = formData.getAll("ticketName").map(String);
  const prices = formData.getAll("ticketPriceCents").map(String);
  const quantities = formData.getAll("ticketQuantity").map(String);

  const ticketTypes = names
    .map((name, index) => ({
      name,
      priceCents: Number(prices[index]),
      quantity: Number(quantities[index]),
      active: true
    }))
    .filter((ticket) => ticket.name);

  const parsed = eventSchema.safeParse({
    ...Object.fromEntries(formData),
    featured: formData.get("featured") === "on",
    published: formData.get("published") !== "off",
    ticketTypes
  });

  if (!parsed.success) throw new Error("Invalid event data");
  const { id, ticketTypes: types, ...data } = parsed.data;
  const slug = slugify(data.title);

  if (id) {
    await prisma.event.update({
      where: { id },
      data: {
        ...data,
        slug,
        ticketTypes: {
          deleteMany: { sold: 0 },
          create: types.map((ticket) => ({
            name: ticket.name,
            description: ticket.description,
            priceCents: ticket.priceCents,
            quantity: ticket.quantity,
            active: ticket.active
          }))
        }
      }
    });
  } else {
    await prisma.event.create({
      data: {
        ...data,
        slug,
        ticketTypes: { create: types }
      }
    });
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  await logActivity({ action: id ? "event.updated" : "event.created", entityType: "Event", entityId: id });
  redirect("/admin/events");
}

export async function deleteEventAction(id: string) {
  await requirePermission("manage_events");
  await prisma.event.update({ where: { id }, data: { published: false } });
  await logActivity({ action: "event.unpublished", entityType: "Event", entityId: id });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function saveDiscountAction(formData: FormData) {
  await requirePermission("manage_discounts");
  const parsed = discountSchema.safeParse({
    ...Object.fromEntries(formData),
    active: formData.get("active") !== "off"
  });

  if (!parsed.success) throw new Error("Invalid discount code");

  await prisma.discountCode.upsert({
    where: { code: parsed.data.code },
    update: parsed.data,
    create: parsed.data
  });

  revalidatePath("/admin/discounts");
  redirect("/admin/discounts");
}

export async function toggleDiscountAction(code: string, active: boolean) {
  await requirePermission("manage_discounts");
  await prisma.discountCode.update({ where: { code }, data: { active } });
  revalidatePath("/admin/discounts");
}

export async function savePricingRuleAction(formData: FormData) {
  await requirePermission("manage_events");
  const parsed = pricingRuleSchema.safeParse({
    ...Object.fromEntries(formData),
    active: formData.get("active") !== "off"
  });
  if (!parsed.success) throw new Error("Invalid pricing rule");

  await prisma.pricingRule.create({ data: parsed.data });
  revalidatePath("/admin/pricing");
  redirect("/admin/pricing");
}

export async function saveCampaignAction(formData: FormData) {
  await requirePermission("manage_users");
  const parsed = campaignSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Invalid campaign");

  await prisma.campaign.create({ data: parsed.data });
  revalidatePath("/admin/campaigns");
  redirect("/admin/campaigns");
}

export async function approveRefundAction(id: string, approved: boolean) {
  await requirePermission("issue_refunds");
  await prisma.refundRequest.update({
    where: { id },
    data: { status: approved ? "APPROVED" : "REJECTED" }
  });
  revalidatePath("/admin/refunds");
}

export async function addCustomerTagAction(formData: FormData) {
  await requirePermission("manage_users");
  const userId = String(formData.get("userId"));
  const tag = String(formData.get("tag") || "").trim().toUpperCase();
  if (!tag) return;

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { tags: true } });
  if (!user || user.tags.includes(tag)) return;

  await prisma.user.update({ where: { id: userId }, data: { tags: { push: tag } } });
  revalidatePath(`/admin/users/${userId}`);
}

export async function duplicateEventAction(id: string) {
  await requirePermission("manage_events");
  const event = await prisma.event.findUnique({
    where: { id },
    include: { ticketTypes: true }
  });
  if (!event) throw new Error("Event not found");

  await prisma.event.create({
    data: {
      tenantId: event.tenantId,
      title: `${event.title} Copy`,
      slug: `${event.slug}-copy-${Date.now().toString(36)}`,
      description: event.description,
      startsAt: new Date(event.startsAt.getTime() + 7 * 24 * 60 * 60 * 1000),
      location: event.location,
      bannerImage: event.bannerImage,
      published: false,
      ticketTypes: {
        create: event.ticketTypes.map((ticket) => ({
          name: ticket.name,
          description: ticket.description,
          priceCents: ticket.priceCents,
          quantity: ticket.quantity,
          active: ticket.active
        }))
      }
    }
  });

  revalidatePath("/admin/events");
  redirect("/admin/events");
}
