import type { MetadataRoute } from "next";

const routes = [
  "",
  "/events",
  "/shop",
  "/gallery",
  "/news",
  "/verify",
  "/login",
  "/admin",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "http://localhost:3000";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}

