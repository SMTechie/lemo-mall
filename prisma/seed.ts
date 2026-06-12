import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const lemoFestEvents = [
  {
    slug: "qoai-fashion-and-art-show-2026",
    title: "QOAI Fashion and Art Show",
    description: "An opening Lemo Fest showcase celebrating fashion, visual art, creators and culture at Lemo Green Park.",
    startsAt: new Date("2026-09-26T17:00:00+02:00"),
    location: "Lemo Green Park",
    bannerImage: image("photo-1509631179647-0177331693ae"),
    featured: true,
    published: true,
    ticketTypes: [
      ["Opening Soon", 0, 1, false]
    ]
  },
  {
    slug: "golf-open-2026",
    title: "Golf Open",
    description: "A Lemo Fest golf day at BFN Golf Club with registration, networking and premium hospitality.",
    startsAt: new Date("2026-10-09T08:00:00+02:00"),
    location: "BFN Golf Club",
    bannerImage: image("photo-1535131749006-b7f58c99034b"),
    featured: true,
    published: true,
    ticketTypes: [
      ["Player Registration", 0, 144, true]
    ]
  },
  {
    slug: "lovers-and-friends-2026",
    title: "Lovers and Friends",
    description: "A soulful Lemo Green Park night built for friends, couples, good music, food and festival energy.",
    startsAt: new Date("2026-10-09T18:00:00+02:00"),
    location: "Lemo Green Park",
    bannerImage: image("photo-1514525253161-7a46d19cd819"),
    featured: true,
    published: true,
    ticketTypes: [
      ["Early Bird", 18000, 300, true],
      ["General", 25000, 700, true],
      ["VIP", 55000, 150, true]
    ]
  },
  {
    slug: "afro-soul-and-jazz-2026",
    title: "Afro Soul and Jazz",
    description: "A premium Afro soul and jazz experience with live performances, lounges and Lemo Fest hospitality.",
    startsAt: new Date("2026-10-10T17:00:00+02:00"),
    location: "Lemo Green Park",
    bannerImage: image("photo-1501386761578-eac5c94b800a"),
    featured: true,
    published: true,
    ticketTypes: [
      ["Early Bird", 20000, 300, true],
      ["General", 30000, 800, true],
      ["VIP", 65000, 180, true]
    ]
  },
  {
    slug: "gospel-experience-2026",
    title: "Gospel Experience",
    description: "A Sunday gospel gathering at Lemo Green Park with worship, family atmosphere and community celebration.",
    startsAt: new Date("2026-10-11T14:00:00+02:00"),
    location: "Lemo Green Park",
    bannerImage: image("photo-1506157786151-b8491531f063"),
    featured: true,
    published: true,
    ticketTypes: [
      ["Early Bird", 15000, 300, true],
      ["General", 22000, 900, true],
      ["VIP", 45000, 120, true]
    ]
  },
  {
    slug: "hangout-2026",
    title: "Hangout",
    description: "A December Lemo Fest hangout bringing music, food, lifestyle and social energy back to Lemo Green Park.",
    startsAt: new Date("2026-12-12T12:00:00+02:00"),
    location: "Lemo Green Park",
    bannerImage: image("photo-1492684223066-81342ee5ff30"),
    featured: true,
    published: true,
    ticketTypes: [
      ["Opening Soon", 0, 1, false]
    ]
  },
  {
    slug: "spin-explosion-2026",
    title: "Spin Explosion",
    description: "A high-energy spinning and motorsport culture experience closing the Lemo Fest December weekend.",
    startsAt: new Date("2026-12-13T12:00:00+02:00"),
    location: "Lemo Green Park",
    bannerImage: image("photo-1500530855697-b586d89ba3ee"),
    featured: true,
    published: true,
    ticketTypes: [
      ["Opening Soon", 0, 1, false]
    ]
  }
] as const;

const permissions = [
  "manage_products",
  "manage_events",
  "manage_orders",
  "view_orders",
  "view_analytics",
  "manage_users",
  "manage_billing",
  "scan_tickets",
  "issue_refunds",
  "manage_discounts"
] as const;

const rolePermissions: Record<string, readonly string[]> = {
  SUPER_ADMIN: permissions,
  TENANT_OWNER: permissions,
  ADMIN: ["manage_products", "manage_events", "manage_orders", "view_orders", "view_analytics", "manage_users", "scan_tickets", "issue_refunds", "manage_discounts"],
  MANAGER: ["manage_products", "manage_events", "manage_orders", "view_orders", "view_analytics", "scan_tickets", "manage_discounts"],
  EVENT_MANAGER: ["manage_events", "view_orders", "view_analytics", "scan_tickets", "manage_discounts"],
  SCANNER_STAFF: ["scan_tickets"],
  SUPPORT_STAFF: ["view_orders", "manage_orders", "issue_refunds"],
  CUSTOMER: []
};

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: "lemo-mall" },
    update: {},
    create: {
      name: "Lemo Mall",
      slug: "lemo-mall",
      plan: "GROWTH",
      platformFeeBps: 250,
      fixedTicketFeeCents: 500,
      supportEmail: "support@lemomall.co.za",
      whatsappNumber: "27821234567"
    }
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@lemomall.co.za" },
    update: { tenantId: tenant.id, referralCode: "ADMINLEMO", role: "SUPER_ADMIN" },
    create: {
      tenantId: tenant.id,
      name: "Admin",
      email: "admin@lemomall.co.za",
      passwordHash: await bcrypt.hash("Admin123!", 12),
      role: "SUPER_ADMIN",
      referralCode: "ADMINLEMO"
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@lemomall.co.za" },
    update: { tenantId: tenant.id, referralCode: "CUSTOMERLEMO", role: "CUSTOMER" },
    create: {
      tenantId: tenant.id,
      name: "Customer",
      email: "customer@lemomall.co.za",
      passwordHash: await bcrypt.hash("Customer123!", 12),
      role: "CUSTOMER",
      referralCode: "CUSTOMERLEMO"
    }
  });

  const permissionRows = new Map<string, string>();
  for (const name of permissions) {
    const permission = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name, description: name.replaceAll("_", " ") }
    });
    permissionRows.set(name, permission.id);
  }

  const roleRows = new Map<string, string>();
  for (const [name, granted] of Object.entries(rolePermissions)) {
    const role = await prisma.role.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name } },
      update: {
        permissions: {
          deleteMany: {},
          create: granted.map((permission) => ({ permissionId: permissionRows.get(permission)! }))
        }
      },
      create: {
        tenantId: tenant.id,
        name,
        description: `${name.toLowerCase().replaceAll("_", " ")} role`,
        permissions: {
          create: granted.map((permission) => ({ permissionId: permissionRows.get(permission)! }))
        }
      }
    });
    roleRows.set(name, role.id);
  }

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: roleRows.get("SUPER_ADMIN")! } },
    update: {},
    create: { userId: admin.id, roleId: roleRows.get("SUPER_ADMIN")! }
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: customer.id, roleId: roleRows.get("CUSTOMER")! } },
    update: {},
    create: { userId: customer.id, roleId: roleRows.get("CUSTOMER")! }
  });

  const products = [
    ["festival-tee", "Festival Tee", "Heavyweight cotton tee with a premium screen print.", 34900, 90, "Apparel", image("photo-1523398002811-999ca8dec234")],
    ["embroidered-cap", "Embroidered Cap", "Structured six-panel cap with stitched Lemo mark.", 24900, 55, "Accessories", image("photo-1521369909029-2afed882baee")],
    ["insulated-bottle", "Insulated Bottle", "Stainless steel bottle for long event days.", 29900, 42, "Lifestyle", image("photo-1602143407151-7111542de6e8")]
  ] as const;

  for (const [slug, name, description, priceCents, stock, category, photo] of products) {
    await prisma.product.upsert({
      where: { slug },
      update: { tenantId: tenant.id },
      create: { tenantId: tenant.id, slug, name, description, priceCents, stock, category, images: [photo], featured: true }
    });
  }

  const event = await prisma.event.upsert({
    where: { slug: "lemo-summer-market-2026" },
    update: { tenantId: tenant.id },
    create: {
      tenantId: tenant.id,
      slug: "lemo-summer-market-2026",
      title: "Lemo Summer Market 2026",
      description: "A full-day market, music, creator merch, food and live performances.",
      startsAt: new Date("2026-12-12T12:00:00+02:00"),
      location: "Johannesburg, South Africa",
      bannerImage: image("photo-1501281668745-f7f57925c3b4"),
      featured: true
    }
  });

  const ticketTypes = [
    ["Early Bird", 12000, 120],
    ["General", 18000, 400],
    ["VIP", 45000, 80]
  ] as const;

  for (const [name, priceCents, quantity] of ticketTypes) {
    await prisma.ticketType.upsert({
      where: { id: `${event.id}-${name}` },
      update: {},
      create: { id: `${event.id}-${name}`, eventId: event.id, name, priceCents, quantity }
    });
  }

  for (const festivalEvent of lemoFestEvents) {
    const savedEvent = await prisma.event.upsert({
      where: { slug: festivalEvent.slug },
      update: {
        tenantId: tenant.id,
        title: festivalEvent.title,
        description: festivalEvent.description,
        startsAt: festivalEvent.startsAt,
        location: festivalEvent.location,
        bannerImage: festivalEvent.bannerImage,
        featured: festivalEvent.featured,
        published: festivalEvent.published
      },
      create: {
        tenantId: tenant.id,
        slug: festivalEvent.slug,
        title: festivalEvent.title,
        description: festivalEvent.description,
        startsAt: festivalEvent.startsAt,
        location: festivalEvent.location,
        bannerImage: festivalEvent.bannerImage,
        featured: festivalEvent.featured,
        published: festivalEvent.published
      }
    });

    for (const [name, priceCents, quantity, active] of festivalEvent.ticketTypes) {
      await prisma.ticketType.upsert({
        where: { id: `${savedEvent.id}-${name}` },
        update: { priceCents, quantity, active },
        create: { id: `${savedEvent.id}-${name}`, eventId: savedEvent.id, name, priceCents, quantity, active }
      });
    }
  }

  await prisma.discountCode.upsert({
    where: { code: "LAUNCH10" },
    update: { tenantId: tenant.id },
    create: { tenantId: tenant.id, code: "LAUNCH10", type: "PERCENTAGE", value: 10, usageLimit: 500 }
  });

  await prisma.pricingRule.upsert({
    where: { id: `${event.id}-early-bird` },
    update: {},
    create: {
      id: `${event.id}-early-bird`,
      eventId: event.id,
      name: "Launch Early Bird",
      type: "EARLY_BIRD",
      discountBps: 1500,
      endsAt: new Date("2026-08-31T23:59:59+02:00")
    }
  });

  console.log({ admin: admin.email, password: "Admin123!" });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
