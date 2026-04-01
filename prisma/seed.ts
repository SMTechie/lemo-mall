import {
  EnquiryStatus,
  EnquiryType,
  OrderItemType,
  OrderStatus,
  OrderType,
  PrismaClient,
  Role,
  SocialSource,
  TicketStatus,
} from "@prisma/client";
import {
  formatDateTime,
  toSlug,
} from "../src/lib/utils";
import {
  createTicketQrPayload,
} from "../src/lib/qr";
import {
  demoDiscountCodes,
  demoEvents,
  demoEnquiries,
  demoGallery,
  demoProducts,
  demoSocialPosts,
  demoTestimonials,
} from "../src/lib/demo-data";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@lemofest.co.za" },
    update: {
      name: "Lemo Fest Admin",
      role: Role.ADMIN,
    },
    create: {
      name: "Lemo Fest Admin",
      email: "admin@lemofest.co.za",
      role: Role.ADMIN,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@lemofest.co.za" },
    update: {
      name: "Scanner Staff",
      role: Role.STAFF,
    },
    create: {
      name: "Scanner Staff",
      email: "staff@lemofest.co.za",
      role: Role.STAFF,
    },
  });

  const events = [];
  for (const item of demoEvents) {
    const event = await prisma.event.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        description: item.description,
        location: item.location,
        venue: item.venue,
        address: item.address,
        startsAt: new Date(item.startsAt),
        endsAt: item.endsAt ? new Date(item.endsAt) : null,
        ticketPriceCents: item.ticketPriceCents,
        currency: item.currency,
        capacity: item.capacity,
        imageUrl: item.imageUrl,
        galleryUrls: item.galleryUrls,
        tags: item.tags,
        featured: item.featured,
        published: item.published,
        schedule: item.schedule,
        createdById: admin.id,
      },
      create: {
        slug: item.slug,
        title: item.title,
        description: item.description,
        location: item.location,
        venue: item.venue,
        address: item.address,
        startsAt: new Date(item.startsAt),
        endsAt: item.endsAt ? new Date(item.endsAt) : null,
        ticketPriceCents: item.ticketPriceCents,
        currency: item.currency,
        capacity: item.capacity,
        imageUrl: item.imageUrl,
        galleryUrls: item.galleryUrls,
        tags: item.tags,
        featured: item.featured,
        published: item.published,
        schedule: item.schedule,
        createdById: admin.id,
      },
    });

    events.push(event);
  }

  const products = [];
  for (const item of demoProducts) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        priceCents: item.priceCents,
        compareAtPriceCents: item.compareAtPriceCents,
        category: item.category,
        inventory: item.inventory,
        featured: item.featured,
        active: item.active,
        imageUrl: item.imageUrl,
        galleryUrls: item.galleryUrls,
      },
      create: {
        slug: item.slug,
        name: item.name,
        description: item.description,
        priceCents: item.priceCents,
        compareAtPriceCents: item.compareAtPriceCents,
        category: item.category,
        inventory: item.inventory,
        featured: item.featured,
        active: item.active,
        imageUrl: item.imageUrl,
        galleryUrls: item.galleryUrls,
      },
    });

    products.push(product);
  }

  for (const item of demoTestimonials) {
    await prisma.testimonial.upsert({
      where: {
        id: `${toSlug(item.name)}-${item.rating}`,
      },
      update: {
        name: item.name,
        role: item.role,
        quote: item.quote,
        avatarUrl: item.avatarUrl,
        rating: item.rating,
        featured: item.featured,
        published: item.published,
      },
      create: {
        id: `${toSlug(item.name)}-${item.rating}`,
        name: item.name,
        role: item.role,
        quote: item.quote,
        avatarUrl: item.avatarUrl,
        rating: item.rating,
        featured: item.featured,
        published: item.published,
      },
    });
  }

  for (const item of demoGallery) {
    await prisma.galleryImage.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        downloadUrl: item.downloadUrl,
        altText: item.altText,
        featured: item.featured,
        published: item.published,
      },
      create: {
        slug: item.slug,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        downloadUrl: item.downloadUrl,
        altText: item.altText,
        featured: item.featured,
        published: item.published,
      },
    });
  }

  for (const item of demoSocialPosts) {
    await prisma.socialPost.upsert({
      where: { externalId: item.externalId },
      update: {
        source: SocialSource.FACEBOOK,
        message: item.message,
        link: item.link,
        imageUrl: item.imageUrl,
        authorName: item.authorName,
        publishedAt: new Date(item.publishedAt),
        featured: item.featured,
      },
      create: {
        externalId: item.externalId,
        source: SocialSource.FACEBOOK,
        message: item.message,
        link: item.link,
        imageUrl: item.imageUrl,
        authorName: item.authorName,
        publishedAt: new Date(item.publishedAt),
        featured: item.featured,
      },
    });
  }

  await prisma.enquiry.deleteMany();
  for (const item of demoEnquiries) {
    await prisma.enquiry.create({
      data: {
        type: item.type as EnquiryType,
        status: item.status as EnquiryStatus,
        name: item.name,
        email: item.email,
        phone: item.phone,
        subject: item.subject,
        message: item.message,
        source: item.source,
        notes: item.notes,
        createdAt: new Date(item.createdAt),
        resolvedAt: item.resolvedAt ? new Date(item.resolvedAt) : null,
      },
    });
  }

  for (const item of demoDiscountCodes) {
    await prisma.discountCode.upsert({
      where: { code: item.code },
      update: {
        description: item.description,
        type: item.type as never,
        value: item.value,
        active: item.active,
        usageLimit: item.usageLimit,
      },
      create: {
        code: item.code,
        description: item.description,
        type: item.type as never,
        value: item.value,
        active: item.active,
        usageLimit: item.usageLimit,
      },
    });
  }

  const paidOrder = await prisma.order.upsert({
    where: { orderNumber: "LF-DEMO-PAID-001" },
    update: {},
    create: {
      orderNumber: "LF-DEMO-PAID-001",
      type: OrderType.TICKET,
      status: OrderStatus.PAID,
      currency: "ZAR",
      subtotalCents: events[0].ticketPriceCents * 2,
      discountCents: 650,
      totalCents: events[0].ticketPriceCents * 2 - 650,
      paygateReference: "LF-DEMO-PAID-001",
      customerName: "Mia Khumalo",
      customerEmail: "mia@example.com",
      customerPhone: "+27 82 555 0101",
      userId: admin.id,
      paidAt: new Date("2026-03-27T14:00:00.000Z"),
      items: {
        create: [
          {
            type: OrderItemType.TICKET,
            name: events[0].title,
            quantity: 2,
            unitPriceCents: events[0].ticketPriceCents,
            totalPriceCents: events[0].ticketPriceCents * 2,
            eventId: events[0].id,
          },
        ],
      },
    },
    include: {
      items: true,
    },
  });

  await prisma.order.upsert({
    where: { orderNumber: "LF-DEMO-PROD-001" },
    update: {},
    create: {
      orderNumber: "LF-DEMO-PROD-001",
      type: OrderType.PRODUCT,
      status: OrderStatus.FULFILLED,
      currency: "ZAR",
      subtotalCents: products[0].priceCents,
      discountCents: 0,
      totalCents: products[0].priceCents,
      paygateReference: "LF-DEMO-PROD-001",
      customerName: "Lebo Dlamini",
      customerEmail: "lebo@example.com",
      customerPhone: "+27 83 555 2020",
      userId: staff.id,
      paidAt: new Date("2026-03-28T14:00:00.000Z"),
      fulfilledAt: new Date("2026-03-29T14:00:00.000Z"),
      items: {
        create: [
          {
            type: OrderItemType.PRODUCT,
            name: products[0].name,
            quantity: 1,
            unitPriceCents: products[0].priceCents,
            totalPriceCents: products[0].priceCents,
            productId: products[0].id,
          },
        ],
      },
    },
  });

  const ticketOneCode = "LF-TICKET-0001";
  const ticketTwoCode = "LF-TICKET-0002";

  await prisma.ticket.upsert({
    where: { code: ticketOneCode },
    update: {},
    create: {
      code: ticketOneCode,
      qrPayload: createTicketQrPayload(ticketOneCode),
      status: TicketStatus.VALID,
      eventId: events[0].id,
      userId: admin.id,
      orderId: paidOrder.id,
      holderName: "Mia Khumalo",
      holderEmail: "mia@example.com",
      notes: `Seeded at ${formatDateTime(new Date())}`,
    },
  });

  await prisma.ticket.upsert({
    where: { code: ticketTwoCode },
    update: {},
    create: {
      code: ticketTwoCode,
      qrPayload: createTicketQrPayload(ticketTwoCode),
      status: TicketStatus.USED,
      eventId: events[0].id,
      userId: admin.id,
      orderId: paidOrder.id,
      holderName: "Mia Khumalo",
      holderEmail: "mia@example.com",
      usedAt: new Date("2026-03-28T10:00:00.000Z"),
      checkedInById: staff.id,
      notes: "Checked in at demo gate B.",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
