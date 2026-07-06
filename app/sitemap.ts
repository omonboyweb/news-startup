import type { MetadataRoute } from "next";

import { articleHref } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";
import { getPublishedArticles } from "@/lib/db/queries";
import { CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();
  const now = new Date();

  const home: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "hourly", priority: 1 },
  ];

  const categories: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${SITE_URL}/?category=${encodeURIComponent(category)}`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.6,
  }));

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}${articleHref(article)}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...home, ...categories, ...articleUrls];
}
