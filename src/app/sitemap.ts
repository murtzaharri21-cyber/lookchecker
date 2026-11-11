import type { MetadataRoute } from "next";
import { guides, tools } from "@/lib/site-data";
import { beautyStudioGuides } from "@/lib/beauty-studio-guides";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/about",
    "/contact",
    "/cookies",
    "/guides",
    "/pricing",
    "/privacy",
    "/refunds",
    "/sample-report",
    "/terms",
    "/beauty-studio",
    "/beauty-studio/guides",
    ...beautyStudioGuides.map(({ slug }) => `/beauty-studio/guides/${slug}`),
    "/tools",
    ...tools.map(({ slug }) => `/tools/${slug}`),
    "/tools/full-analysis",
    ...guides.map(({ slug }) => `/guides/${slug}`),
  ];

  return pages.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: path.startsWith("/tools/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/tools/") ? 0.8 : path.startsWith("/guides/") ? 0.7 : 0.6,
  }));
}
