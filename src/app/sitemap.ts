import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticRoutes = [
    { url: base, lastModified: new Date() },
    { url: `${base}/shop`, lastModified: new Date() },
    { url: `${base}/events`, lastModified: new Date() },
    { url: `${base}/programme`, lastModified: new Date() },
    { url: `${base}/lineup`, lastModified: new Date() },
    { url: `${base}/highlights`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    { url: `${base}/help`, lastModified: new Date() },
    { url: `${base}/bar-card-refunds`, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
    { url: `${base}/terms`, lastModified: new Date() },
    { url: `${base}/refunds`, lastModified: new Date() },
    { url: `${base}/forgot-password`, lastModified: new Date() }
  ];

  if (!process.env.DATABASE_URL) {
    return staticRoutes;
  }
  const [products, events] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    prisma.event.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })
  ]);

  return [
    ...staticRoutes,
    ...products.map((product) => ({ url: `${base}/shop/${product.slug}`, lastModified: product.updatedAt })),
    ...events.map((event) => ({ url: `${base}/events/${event.slug}`, lastModified: event.updatedAt }))
  ];
}
