import "server-only";

import { cache } from "react";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { articles, type ArticleRow } from "@/lib/db/schema";
import type { Article, Category, Region } from "@/lib/types";

// Rasm yo'q maqolalar uchun zaxira cover (keyinroq kategoriya shablonlariga
// almashtiriladi â TZ 4.5).
const FALLBACK_IMAGE = "https://picsum.photos/seed/auranews/1200/800";

type ArticleRowWithSources = ArticleRow & {
  sources?: { name: string; url: string }[];
};

/** DB satrini frontend view-model'iga aylantiradi. */
function toArticle(row: ArticleRowWithSources): Article {
  return {
    id: row.slug,
    title: row.title,
    tldr: row.tldr,
    content: row.content,
    category: row.category,
    region: row.region,
    imageUrl: row.imageUrl ?? FALLBACK_IMAGE,
    publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
    readTime: row.readTimeMinutes,
    sources: (row.sources ?? []).map((s) => ({ name: s.name, url: s.url })),
  };
}

/** Chop etilgan maqolalar, rukn/hudud bo'yicha filtrlab, yangidan eskiga. */
export async function getPublishedArticles(
  filters: { category?: Category; region?: Region } = {},
): Promise<Article[]> {
  const conditions = [eq(articles.status, "published")];
  if (filters.category) {
    conditions.push(eq(articles.category, filters.category));
  }
  if (filters.region) {
    conditions.push(eq(articles.region, filters.region));
  }

  const rows = await db
    .select()
    .from(articles)
    .where(and(...conditions))
    .orderBy(desc(articles.publishedAt));

  return rows.map(toArticle);
}

/** "Eng ko'p o'qilgan" â ko'rishlar soni bo'yicha. */
export async function getMostReadArticles(limit = 5): Promise<Article[]> {
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.viewCount), desc(articles.publishedAt))
    .limit(limit);

  return rows.map(toArticle);
}

// cache() â generateMetadata va page komponenti bir so'rovda bitta DB
// o'qishni baham ko'rishi uchun (ikki marta so'ramaslik).
export const getPublishedArticleBySlug = cache(
  async (slug: string): Promise<Article | undefined> => {
    const row = await db.query.articles.findFirst({
      where: and(eq(articles.slug, slug), eq(articles.status, "published")),
      with: {
        sources: {
          columns: { name: true, url: true },
        },
      },
    });

    return row ? toArticle(row) : undefined;
  },
);
