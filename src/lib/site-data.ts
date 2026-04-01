import {
  demoEvents,
  demoEnquiries,
  demoGallery,
  demoProducts,
  demoSocialPosts,
  demoTestimonials,
} from "./demo-data";
import { prisma } from "./db";
import { listDemoOrders, listDemoTickets } from "./demo-store";

type BaseEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  venue: string | null;
  address: string | null;
  startsAt: Date;
  endsAt: Date | null;
  ticketPriceCents: number;
  currency: string;
  capacity: number | null;
  imageUrl: string;
  galleryUrls: string[];
  tags: string[];
  featured: boolean;
  published: boolean;
  schedule: unknown;
  displayDateLabel?: string | null;
};

type BaseProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  category: string;
  inventory: number;
  featured: boolean;
  active: boolean;
  imageUrl: string;
  galleryUrls: string[];
};

type BaseTestimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  avatarUrl: string | null;
  rating: number;
  featured: boolean;
  published: boolean;
};

type BaseGallery = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  imageUrl: string;
  downloadUrl: string | null;
  altText: string | null;
  eventId: string | null;
  featured: boolean;
  published: boolean;
};

type BaseSocialPost = {
  id: string;
  source: string;
  externalId: string | null;
  message: string;
  link: string | null;
  imageUrl: string | null;
  authorName: string | null;
  publishedAt: Date;
  featured: boolean;
};

type Analytics = {
  ticketsSold: number;
  revenueCents: number;
  paidOrders: number;
  activeEvents: number;
  activeProducts: number;
  openEnquiries: number;
  lowStockProducts: number;
};

type BaseEnquiry = {
  id: string;
  type: string;
  status: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  source: string;
  notes: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
};

type BaseTicket = {
  id: string;
  code: string;
  status: string;
  holderName: string | null;
  holderEmail: string | null;
  usedAt: Date | null;
  event: {
    id: string;
    title: string;
    slug: string;
    location: string;
    startsAt: Date;
  };
  order: {
    orderNumber: string;
    status: string;
  } | null;
};

function toDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

function mapDemoEvents(): BaseEvent[] {
  return demoEvents.map((event) => ({
    id: event.slug,
    slug: event.slug,
    title: event.title,
    description: event.description,
    location: event.location,
    venue: event.venue ?? null,
    address: event.address ?? null,
    startsAt: toDate(event.startsAt),
    endsAt: event.endsAt ? toDate(event.endsAt) : null,
    ticketPriceCents: event.ticketPriceCents,
    currency: event.currency,
    capacity: event.capacity ?? null,
    imageUrl: event.imageUrl,
    galleryUrls: event.galleryUrls,
    tags: event.tags,
    featured: event.featured,
    published: event.published,
    schedule: event.schedule,
    displayDateLabel: event.displayDateLabel ?? null,
  }));
}

function mapDemoProducts(): BaseProduct[] {
  return demoProducts.map((product) => ({
    id: product.slug,
    slug: product.slug,
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    compareAtPriceCents: product.compareAtPriceCents ?? null,
    category: product.category,
    inventory: product.inventory,
    featured: product.featured,
    active: product.active,
    imageUrl: product.imageUrl,
    galleryUrls: product.galleryUrls,
  }));
}

function mapDemoTestimonials(): BaseTestimonial[] {
  return demoTestimonials.map((testimonial, index) => ({
    id: `${testimonial.name}-${index}`,
    name: testimonial.name,
    role: testimonial.role ?? null,
    quote: testimonial.quote,
    avatarUrl: testimonial.avatarUrl ?? null,
    rating: testimonial.rating,
    featured: testimonial.featured,
    published: testimonial.published,
  }));
}

function mapDemoGallery(): BaseGallery[] {
  return demoGallery.map((item, index) => ({
    id: `${item.slug}-${index}`,
    slug: item.slug,
    title: item.title,
    description: item.description ?? null,
    imageUrl: item.imageUrl,
    downloadUrl: item.downloadUrl ?? null,
    altText: item.altText ?? null,
    eventId: null,
    featured: item.featured,
    published: item.published,
  }));
}

function mapDemoSocial(): BaseSocialPost[] {
  return demoSocialPosts.map((item, index) => ({
    id: `${item.externalId ?? index}`,
    source: item.source,
    externalId: item.externalId ?? null,
    message: item.message,
    link: item.link ?? null,
    imageUrl: item.imageUrl ?? null,
    authorName: item.authorName ?? null,
    publishedAt: toDate(item.publishedAt),
    featured: item.featured,
  }));
}

function mapDemoEnquiries(): BaseEnquiry[] {
  return demoEnquiries.map((item, index) => ({
    id: `enquiry-demo-${index + 1}`,
    type: item.type,
    status: item.status,
    name: item.name,
    email: item.email,
    phone: item.phone,
    subject: item.subject,
    message: item.message,
    source: item.source,
    notes: item.notes,
    createdAt: toDate(item.createdAt),
    resolvedAt: item.resolvedAt ? toDate(item.resolvedAt) : null,
  }));
}

function mapDemoTickets(): BaseTicket[] {
  const event = mapDemoEvents()[0];
  return [
    {
      id: "ticket-demo-1",
      code: "LF-DEMO-0001",
      status: "VALID",
      holderName: "Mia Khumalo",
      holderEmail: "mia@example.com",
      usedAt: null,
      event,
      order: {
        orderNumber: "LF-DEMO-PAID-001",
        status: "PAID",
      },
    },
    {
      id: "ticket-demo-2",
      code: "LF-DEMO-0002",
      status: "USED",
      holderName: "Mia Khumalo",
      holderEmail: "mia@example.com",
      usedAt: new Date("2026-03-28T10:00:00.000Z"),
      event,
      order: {
        orderNumber: "LF-DEMO-PAID-001",
        status: "PAID",
      },
    },
  ];
}

async function safeQuery<T>(query: () => Promise<T>, fallback: T) {
  if (!process.env.DATABASE_URL) {
    return fallback;
  }

  try {
    return await query();
  } catch {
    return fallback;
  }
}

export async function getHomeData() {
  const [events, testimonials, gallery, products, social, analytics] =
    await Promise.all([
      getFeaturedEvents(),
      getFeaturedTestimonials(),
      getFeaturedGallery(),
      getFeaturedProducts(),
      getFeaturedSocialPosts(),
      getAnalytics(),
    ]);

  return {
    events,
    testimonials,
    gallery,
    products,
    social,
    analytics,
  };
}

export async function getFeaturedEvents(): Promise<BaseEvent[]> {
  return safeQuery<BaseEvent[]>(
    async () =>
      prisma.event.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { startsAt: "asc" }],
        take: 8,
      }) as unknown as BaseEvent[],
    mapDemoEvents(),
  );
}

export async function getAllEvents(): Promise<BaseEvent[]> {
  return safeQuery<BaseEvent[]>(
    async () =>
      prisma.event.findMany({
        orderBy: [{ published: "desc" }, { startsAt: "asc" }],
      }) as unknown as BaseEvent[],
    mapDemoEvents(),
  );
}

export async function getEventBySlug(slug: string): Promise<BaseEvent | null> {
  return safeQuery<BaseEvent | null>(
    async () => {
      const event = await prisma.event.findUnique({ where: { slug } });
      return event as BaseEvent | null;
    },
    mapDemoEvents().find((event) => event.slug === slug) ?? null,
  );
}

export async function getFeaturedProducts(): Promise<BaseProduct[]> {
  return safeQuery(
    () =>
      prisma.product.findMany({
        where: { active: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 4,
      }),
    mapDemoProducts(),
  );
}

export async function getProductBySlug(slug: string): Promise<BaseProduct | null> {
  return safeQuery(
    async () => prisma.product.findUnique({ where: { slug } }),
    mapDemoProducts().find((product) => product.slug === slug) ?? null,
  );
}

export async function getFeaturedTestimonials(): Promise<BaseTestimonial[]> {
  return safeQuery(
    () =>
      prisma.testimonial.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 6,
      }),
    mapDemoTestimonials(),
  );
}

export async function getFeaturedGallery(): Promise<BaseGallery[]> {
  return safeQuery(
    () =>
      prisma.galleryImage.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 14,
      }),
    mapDemoGallery(),
  );
}

export async function getFeaturedSocialPosts(): Promise<BaseSocialPost[]> {
  return safeQuery(
    () =>
      prisma.socialPost.findMany({
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        take: 4,
      }),
    mapDemoSocial(),
  );
}

export async function getAnalytics(): Promise<Analytics> {
  return safeQuery(
    async () => {
      const [ticketsSold, revenue, paidOrders, activeEvents, activeProducts, openEnquiries, lowStockProducts] =
        await Promise.all([
          prisma.ticket.count({
            where: { status: { in: ["VALID", "USED"] } },
          }),
          prisma.order.aggregate({
            _sum: { totalCents: true },
            where: { status: "PAID" },
          }),
          prisma.order.count({ where: { status: "PAID" } }),
          prisma.event.count({ where: { published: true } }),
          prisma.product.count({ where: { active: true } }),
          prisma.enquiry.count({ where: { status: { in: ["NEW", "IN_PROGRESS"] } } }),
          prisma.product.count({ where: { active: true, inventory: { lte: 10 } } }),
        ]);

      return {
        ticketsSold,
        revenueCents: revenue._sum.totalCents ?? 0,
        paidOrders,
        activeEvents,
        activeProducts,
        openEnquiries,
        lowStockProducts,
      };
    },
    {
      ticketsSold: listDemoTickets().length || 384,
      revenueCents: listDemoOrders().length
        ? listDemoOrders()
            .filter((order) => order.status === "PAID")
            .reduce((sum, order) => sum + order.totalCents, 0)
        : 246500,
      paidOrders: listDemoOrders().length
        ? listDemoOrders().filter((order) => order.status === "PAID").length
        : 112,
      activeEvents: demoEvents.length,
      activeProducts: demoProducts.length,
      openEnquiries: demoEnquiries.filter((enquiry) => enquiry.status !== "RESOLVED").length,
      lowStockProducts: demoProducts.filter((product) => product.inventory <= 10).length,
    },
  );
}

export async function getAdminEvents() {
  return getAllEvents();
}

export async function getAdminProducts() {
  return safeQuery(
    () => prisma.product.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] }),
    mapDemoProducts(),
  );
}

export async function getAdminTestimonials() {
  return safeQuery(
    () => prisma.testimonial.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] }),
    mapDemoTestimonials(),
  );
}

export async function getAdminGallery() {
  return safeQuery(
    () => prisma.galleryImage.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] }),
    mapDemoGallery(),
  );
}

export async function getAdminSocialPosts() {
  return safeQuery(
    () => prisma.socialPost.findMany({ orderBy: [{ featured: "desc" }, { publishedAt: "desc" }] }),
    mapDemoSocial(),
  );
}

export async function getEnquiries(): Promise<BaseEnquiry[]> {
  return safeQuery(
    () =>
      prisma.enquiry.findMany({
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      }) as unknown as Promise<BaseEnquiry[]>,
    mapDemoEnquiries(),
  );
}

export async function getAdminEnquiries() {
  return getEnquiries();
}

export async function getOrders() {
  return safeQuery(
    () =>
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          tickets: true,
        },
      }),
    listDemoOrders().length
      ? (listDemoOrders() as never)
      : ([
          {
            id: "order-demo-1",
            orderNumber: "LF-DEMO-PAID-001",
            status: "PAID",
            type: "TICKET",
            totalCents: 12300,
            customerName: "Mia Khumalo",
            customerEmail: "mia@example.com",
            createdAt: new Date(),
            items: [],
            tickets: [],
          },
        ] as never),
  );
}

export async function getAdminTickets(): Promise<BaseTicket[]> {
  return safeQuery(
    () =>
      prisma.ticket.findMany({
        orderBy: [{ createdAt: "desc" }],
        include: {
          event: true,
          order: true,
          },
        }),
    listDemoTickets().length ? (listDemoTickets() as never) : mapDemoTickets(),
  );
}
