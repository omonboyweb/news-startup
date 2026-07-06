import { deepseek } from "@ai-sdk/deepseek";
import { generateObject } from "ai";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import * as schema from "@/lib/db/schema";
import { articles, articleSources, clusters, rawItems, sources } from "@/lib/db/schema";
import { slugify } from "@/lib/slug";

type GenerateDb = PostgresJsDatabase<typeof schema>;

const model = deepseek("deepseek-chat");

// TZ 4.3: AI o'zbekcha maqola, TL;DR, SEO, teglar yaratadi va manbalar
// orasidagi ziddiyatlarni FLAG qiladi (hal qilmaydi).
const GeneratedArticleSchema = z.object({
  title: z.string().describe("Aniq, jozibali o'zbekcha (lotin) sarlavha"),
  tldr: z
    .array(z.string())
    .length(3)
    .describe("Aynan 3 ta qisqa tezis (AI xulosasi)"),
  content: z
    .string()
    .describe(
      "Tuzilmali maqola matni, 3-6 paragraf. Paragraflar ikki qator (\\n\\n) bilan ajratiladi.",
    ),
  seoTitle: z.string().describe("SEO sarlavha (<= 60 belgi)"),
  seoDescription: z.string().describe("SEO tavsif (<= 160 belgi)"),
  tags: z.array(z.string()).max(6).describe("Mavzu teglari"),
  category: z.enum(["Siyosat", "Iqtisodiyot", "Sport", "Texnologiya", "Ilm-fan"]),
  region: z.enum(["Uzbekistan", "Jahon"]),
  editorialConflicts: z
    .array(z.string())
    .describe(
      "Manbalar orasidagi ziddiyatlar, masalan 'Manba A 50 deydi, Manba B 70 deydi'. Ziddiyat yo'q bo'lsa bo'sh massiv.",
    ),
});

type ClusterItem = {
  title: string;
  summary: string | null;
  url: string;
  sourceName: string;
};

const SYSTEM_PROMPT = `Siz o'zbek tilidagi zamonaviy yangiliklar portalining tajribali muharririsiz.
Sizga bitta voqea haqidagi turli manbalardan olingan xabarlar beriladi. Vazifangiz:

1. Faqat berilgan manbalarga tayangan holda O'ZBEK TILIDA (lotin alifbosida) qisqa,
   tuzilmali, neytral maqola yozing. Yangi faktlar TO'QIB CHIQARMANG.
2. Siz fakt-tekshiruvchi EMASSIZ. Manbalar bir-biriga zid bo'lsa, ularni HAL QILMANG â
   editorialConflicts ro'yxatiga "Manba A ... deydi, Manba B ... deydi" ko'rinishida yozing.
3. Aynan 3 ta TL;DR tezis, mos rukn va hudud tanlang.
4. Sensatsiya va his-hayajonli tildan saqlaning; jurnalistik, xolis uslub.`;

function buildUserPrompt(items: ClusterItem[]): string {
  const blocks = items
    .map((item, i) => {
      const parts = [
        `Manba ${i + 1}: ${item.sourceName}`,
        `Sarlavha: ${item.title}`,
      ];
      if (item.summary) parts.push(`Mazmun: ${item.summary}`);
      parts.push(`URL: ${item.url}`);
      return parts.join("\n");
    })
    .join("\n\n---\n\n");

  return `Quyidagi manbalar asosida bitta o'zbekcha maqola tayyorlang:\n\n${blocks}`;
}

/** Slug band bo'lsa -2, -3 ... qo'shib bo'sh slug qaytaradi. */
async function uniqueSlug(db: GenerateDb, base: string): Promise<string> {
  const candidate = base || `maqola-${Date.now()}`;
  const taken = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(sql`${articles.slug} = ${candidate} OR ${articles.slug} LIKE ${`${candidate}-%`}`);

  const takenSet = new Set(taken.map((r) => r.slug));
  if (!takenSet.has(candidate)) return candidate;

  let n = 2;
  while (takenSet.has(`${candidate}-${n}`)) n++;
  return `${candidate}-${n}`;
}

export interface GeneratedResult {
  clusterId: string;
  articleId?: string;
  slug?: string;
  skipped?: boolean;
  error?: string;
}

/** Bitta klaster uchun draft maqola yaratadi (attribution bilan). */
export async function generateArticleForCluster(
  db: GenerateDb,
  clusterId: string,
): Promise<GeneratedResult> {
  const items: ClusterItem[] = await db
    .select({
      title: rawItems.title,
      summary: rawItems.summary,
      url: rawItems.url,
      sourceName: sources.name,
    })
    .from(rawItems)
    .innerJoin(sources, eq(sources.id, rawItems.sourceId))
    .where(eq(rawItems.clusterId, clusterId));

  if (items.length === 0) {
    return { clusterId, skipped: true };
  }

  const { object } = await generateObject({
    model,
    schema: GeneratedArticleSchema,
    system: SYSTEM_PROMPT,
    prompt: buildUserPrompt(items),
    temperature: 0.4,
  });

  const slug = await uniqueSlug(db, slugify(object.title));
  // TZ 4.4: Siyosat = yuqori xavf (pre-moderation). Boshqalari past xavf.
  const riskLevel = object.category === "Siyosat" ? "high" : "low";
  const wordCount = object.content.trim().split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.round(wordCount / 180));

  const [inserted] = await db
    .insert(articles)
    .values({
      slug,
      title: object.title,
      content: object.content,
      tldr: object.tldr,
      category: object.category,
      region: object.region,
      status: "draft", // human-in-the-loop: muharrir tasdig'ini kutadi
      riskLevel,
      editorialNotes: object.editorialConflicts,
      readTimeMinutes,
      seoTitle: object.seoTitle,
      seoDescription: object.seoDescription,
    })
    .returning({ id: articles.id });

  // Attribution: klaster manbalaridan (URL bo'yicha takrorlanmaydi).
  const seen = new Set<string>();
  const attribution = items
    .filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .map((item) => ({
      articleId: inserted.id,
      name: item.sourceName,
      url: item.url,
    }));

  if (attribution.length > 0) {
    await db.insert(articleSources).values(attribution);
  }

  await db
    .update(clusters)
    .set({ status: "generated" })
    .where(eq(clusters.id, clusterId));
  await db
    .update(rawItems)
    .set({ status: "generated" })
    .where(eq(rawItems.clusterId, clusterId));

  return { clusterId, articleId: inserted.id, slug };
}

export interface GenerateSummary {
  totalClusters: number;
  generated: number;
  results: GeneratedResult[];
}

/** Ochiq klasterlardan (ko'p elementlisidan boshlab) draft maqolalar yaratadi. */
export async function generateDrafts(
  db: GenerateDb,
  options: { limit?: number } = {},
): Promise<GenerateSummary> {
  const limit = options.limit ?? 5;

  const openClusters = await db
    .select({ id: clusters.id })
    .from(clusters)
    .where(eq(clusters.status, "open"))
    .orderBy(desc(clusters.itemCount))
    .limit(limit);

  const results: GeneratedResult[] = [];
  for (const cluster of openClusters) {
    try {
      results.push(await generateArticleForCluster(db, cluster.id));
    } catch (error) {
      results.push({
        clusterId: cluster.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    totalClusters: openClusters.length,
    generated: results.filter((r) => r.articleId).length,
    results,
  };
}
