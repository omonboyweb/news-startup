import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { desc, eq } from "drizzle-orm";

import * as schema from "@/lib/db/schema";
import { articles } from "@/lib/db/schema";
import type { Category, Region } from "@/lib/types";

type AdminDb = PostgresJsDatabase<typeof schema>;

export interface ModerationArticle {
  id: string;
  slug: string;
  title: string;
  category: Category;
  region: Region;
  riskLevel: "low" | "high";
  status: "draft" | "published" | "rejected";
  tldr: string[];
  editorialNotes: string[];
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  publishedAt: string | null;
  sources: { name: string; url: string }[];
}

function toModeration(row: {
  id: string;
  slug: string;
  title: string;
  category: Category;
  region: Region;
  riskLevel: "low" | "high";
  status: "draft" | "published" | "rejected";
  tldr: string[];
  editorialNotes: string[];
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  publishedAt: Date | null;
  sources: { name: string; url: string }[];
}): ModerationArticle {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    publishedAt: row.publishedAt?.toISOString() ?? null,
  };
}

/** Moderatsiya navbati: muharrir tasdig'ini kutayotgan draftlar (yangidan eskiga). */
export async function getDraftArticles(db: AdminDb): Promise<ModerationArticle[]> {
  const rows = await db.query.articles.findMany({
    where: eq(articles.status, "draft"),
    orderBy: desc(articles.createdAt),
    with: { sources: { columns: { name: true, url: true } } },
  });
  return rows.map(toModeration);
}

/** Saytga chiqqan maqolalar â admin panelda tahrirlash uchun (yangidan eskiga). */
export async function getPublishedArticlesForAdmin(
  db: AdminDb,
): Promise<ModerationArticle[]> {
  const rows = await db.query.articles.findMany({
    where: eq(articles.status, "published"),
    orderBy: desc(articles.publishedAt),
    with: { sources: { columns: { name: true, url: true } } },
  });
  return rows.map(toModeration);
}

/** Bitta maqola (har qanday status) â tahrirlash uchun. */
export async function getModerationArticleById(
  db: AdminDb,
  id: string,
): Promise<ModerationArticle | undefined> {
  const row = await db.query.articles.findFirst({
    where: eq(articles.id, id),
    with: { sources: { columns: { name: true, url: true } } },
  });
  return row ? toModeration(row) : undefined;
}

/** Draftni chop etadi (TZ 4.4 approve): status=published + published_at. */
export async function publishArticle(db: AdminDb, id: string) {
  const [row] = await db
    .update(articles)
    .set({ status: "published", publishedAt: new Date() })
    .where(eq(articles.id, id))
    .returning({ slug: articles.slug, category: articles.category });
  return row;
}

/** Chop etilgan maqolani saytdan qaytarib oladi (status=draft, navbatga qaytadi). */
export async function unpublishArticle(db: AdminDb, id: string) {
  const [row] = await db
    .update(articles)
    .set({ status: "draft", publishedAt: null })
    .where(eq(articles.id, id))
    .returning({ slug: articles.slug, category: articles.category });
  return row;
}

/** Draftni rad etadi (TZ 4.4 reject). */
export async function rejectArticle(db: AdminDb, id: string) {
  await db
    .update(articles)
    .set({ status: "rejected" })
    .where(eq(articles.id, id));
}

export interface ArticleEditFields {
  title: string;
  content: string;
  tldr: string[];
  category?: Category;
  region?: Region;
  seoTitle: string | null;
  seoDescription: string | null;
}

/** Muharrir tahrirlarini saqlaydi (rukn o'zgarsa risk_level qayta hisoblanadi). */
export async function updateArticleContent(
  db: AdminDb,
  id: string,
  fields: ArticleEditFields,
) {
  const set: Partial<typeof articles.$inferInsert> = {
    title: fields.title,
    content: fields.content,
    tldr: fields.tldr,
    seoTitle: fields.seoTitle,
    seoDescription: fields.seoDescription,
  };
  if (fields.category) {
    set.category = fields.category;
    set.riskLevel = fields.category === "Siyosat" ? "high" : "low";
  }
  if (fields.region) {
    set.region = fields.region;
  }
  await db.update(articles).set(set).where(eq(articles.id, id));
}
