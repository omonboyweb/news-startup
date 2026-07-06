import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

// ---- Enumlar ---------------------------------------------------------------

export const categoryEnum = pgEnum("category", [
  "Siyosat",
  "Iqtisodiyot",
  "Sport",
  "Texnologiya",
  "Ilm-fan",
]);

export const regionEnum = pgEnum("region", ["Uzbekistan", "Jahon"]);

// draft â muharrir ko'rib chiqishi kutilmoqda; published â saytda ko'rinadi;
// rejected â muharrir rad etgan (TZ 4.4 human-in-the-loop).
export const articleStatusEnum = pgEnum("article_status", [
  "draft",
  "published",
  "rejected",
]);

// TZ 4.4: past xavfli ruknlar auto-publish, yuqori xavflilar pre-moderation.
export const riskLevelEnum = pgEnum("risk_level", ["low", "high"]);

// TZ 4.1: taqiqlangan manbalar faqat "xabar berish" rejimida ishlatiladi.
export const sourceReusePolicyEnum = pgEnum("source_reuse_policy", [
  "full_rewrite",
  "report_only",
]);

// Xom (ingest qilingan) manba elementining pipeline holati:
// new â yangi yig'ilgan; clustered â klasterga biriktirilgan (3-qadam);
// generated â undan maqola yaratilgan (4-qadam); skipped â e'tiborsiz.
export const rawItemStatusEnum = pgEnum("raw_item_status", [
  "new",
  "clustered",
  "generated",
  "skipped",
]);

// Klaster holati: open â yig'ilmoqda; generated â maqola yaratilgan (4-qadam).
export const clusterStatusEnum = pgEnum("cluster_status", ["open", "generated"]);

// Embedding o'lchami embeddings moduli bilan bir xil bo'lishi shart.
export const EMBEDDING_DIMENSIONS = 768;

// ---- Jadvallar -------------------------------------------------------------

export const sources = pgTable(
  "sources",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    homepageUrl: text(),
    feedUrl: text(),
    reusePolicy: sourceReusePolicyEnum().notNull().default("report_only"),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("sources_name_key").on(t.name)],
);

export const articles = pgTable(
  "articles",
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: text().notNull(),
    title: text().notNull(),
    content: text().notNull(),
    // AI xulosasi (TL;DR) â muharrir tasdiqlagan tezislar.
    tldr: jsonb().$type<string[]>().notNull().default([]),
    category: categoryEnum().notNull(),
    region: regionEnum().notNull(),
    status: articleStatusEnum().notNull().default("draft"),
    riskLevel: riskLevelEnum().notNull().default("low"),
    // AI manbalar orasidagi ziddiyatlarni belgilaydi (hal qilmaydi) â TZ 4.3.
    editorialNotes: jsonb().$type<string[]>().notNull().default([]),
    imageUrl: text(),
    readTimeMinutes: integer().notNull().default(3),
    viewCount: integer().notNull().default(0),
    seoTitle: text(),
    seoDescription: text(),
    publishedAt: timestamp({ withTimezone: true }),
    // TZ 5: Telegram kanalga qachon yuborilgani. Null = hali yuborilmagan.
    // Retry/qayta-approve'da dublikat post ketmasligini shu ta'minlaydi.
    telegramPostedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("articles_slug_key").on(t.slug),
    index("articles_status_published_at_idx").on(t.status, t.publishedAt),
    index("articles_category_idx").on(t.category),
  ],
);

// TZ 2/8: har maqola ostida manba attribution (huquqiy himoya + E-E-A-T).
export const articleSources = pgTable(
  "article_sources",
  {
    id: uuid().primaryKey().defaultRandom(),
    articleId: uuid()
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    sourceId: uuid().references(() => sources.id, { onDelete: "set null" }),
    // Ko'rsatish uchun denormalizatsiya â manba o'chsa ham havola saqlanadi.
    name: text().notNull(),
    url: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("article_sources_article_id_idx").on(t.articleId)],
);

// TZ 4.2: bir voqea haqidagi turli manba elementlari bitta klasterga birlashadi.
export const clusters = pgTable("clusters", {
  id: uuid().primaryKey().defaultRandom(),
  // Klasterning ilk (reprezentativ) elementi sarlavhasi â admin/log uchun.
  representativeTitle: text(),
  itemCount: integer().notNull().default(0),
  status: clusterStatusEnum().notNull().default("open"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// TZ 4.1: manbalardan yig'ilgan xom yangiliklar (generatsiyagacha bo'lgan input).
export const rawItems = pgTable(
  "raw_items",
  {
    id: uuid().primaryKey().defaultRandom(),
    sourceId: uuid()
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    clusterId: uuid().references(() => clusters.id, { onDelete: "set null" }),
    // Feed elementining barqaror identifikatori (guid yoki link).
    guid: text().notNull(),
    url: text().notNull(),
    title: text().notNull(),
    summary: text(),
    content: text(),
    // Manba tili (masalan "uz", "en") â cross-lingual dedup uchun foydali.
    language: text(),
    // TZ 4.2: embedding (pgvector) â cosine o'xshashlik bo'yicha klasterlash.
    embedding: vector({ dimensions: EMBEDDING_DIMENSIONS }),
    publishedAt: timestamp({ withTimezone: true }),
    status: rawItemStatusEnum().notNull().default("new"),
    fetchedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Bitta manbada bir guid faqat bir marta â idempotent ingestion.
    uniqueIndex("raw_items_source_guid_key").on(t.sourceId, t.guid),
    index("raw_items_status_idx").on(t.status),
    index("raw_items_cluster_id_idx").on(t.clusterId),
    // HNSW indeksi cosine masofa bo'yicha tez qidiruv uchun.
    index("raw_items_embedding_idx").using(
      "hnsw",
      t.embedding.op("vector_cosine_ops"),
    ),
  ],
);

// ---- Relations (relational query API uchun) --------------------------------

export const articlesRelations = relations(articles, ({ many }) => ({
  sources: many(articleSources),
}));

export const sourcesRelations = relations(sources, ({ many }) => ({
  articleSources: many(articleSources),
  rawItems: many(rawItems),
}));

export const rawItemsRelations = relations(rawItems, ({ one }) => ({
  source: one(sources, {
    fields: [rawItems.sourceId],
    references: [sources.id],
  }),
  cluster: one(clusters, {
    fields: [rawItems.clusterId],
    references: [clusters.id],
  }),
}));

export const clustersRelations = relations(clusters, ({ many }) => ({
  items: many(rawItems),
}));

export const articleSourcesRelations = relations(articleSources, ({ one }) => ({
  article: one(articles, {
    fields: [articleSources.articleId],
    references: [articles.id],
  }),
  source: one(sources, {
    fields: [articleSources.sourceId],
    references: [sources.id],
  }),
}));

// ---- Xulosa qilingan turlar ------------------------------------------------

export type ArticleRow = typeof articles.$inferSelect;
export type NewArticleRow = typeof articles.$inferInsert;
export type SourceRow = typeof sources.$inferSelect;
export type ArticleSourceRow = typeof articleSources.$inferSelect;
export type RawItemRow = typeof rawItems.$inferSelect;
export type NewRawItemRow = typeof rawItems.$inferInsert;
export type ClusterRow = typeof clusters.$inferSelect;
