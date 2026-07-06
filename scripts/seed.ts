import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { articleSources, articles, sources } from "../lib/db/schema";
import { seedArticles, seedSources } from "./seed-data";

// TZ 4.4: yuqori xavfli ruknlar (Siyosat/Jamiyat/O'zbekiston) pre-moderation
// talab qiladi. Hozircha Siyosat = high, qolganlari low.
function riskLevelFor(category: string): "low" | "high" {
  return category === "Siyosat" ? "high" : "low";
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL o'rnatilmagan (.env fayliga qarang).");
  }

  const client = postgres(connectionString, { max: 1 });
  // casing: schema bilan bir xil bo'lishi shart (camelCase -> snake_case).
  const db = drizzle(client, { casing: "snake_case" });

  try {
    console.log("→Eski ma'lumotlar tozalanmoqda...");
    await db.delete(articleSources);
    await db.delete(articles);
    await db.delete(sources);

    console.log("→Manbalar qo'shilmoqda...");
    const insertedSources = await db
      .insert(sources)
      .values(
        seedSources.map((s) => ({
          name: s.name,
          homepageUrl: s.homepageUrl,
          feedUrl: s.feedUrl,
          reusePolicy: s.reusePolicy,
        })),
      )
      .returning({ id: sources.id, name: sources.name });

    const sourceIdByName = new Map(
      insertedSources.map((s) => [s.name, s.id] as const),
    );

    console.log("→Maqolalar qo'shilmoqda...");
    for (const a of seedArticles) {
      const [inserted] = await db
        .insert(articles)
        .values({
          slug: a.slug,
          title: a.title,
          content: a.content,
          tldr: a.tldr,
          category: a.category,
          region: a.region,
          status: "published",
          riskLevel: riskLevelFor(a.category),
          imageUrl: a.imageUrl,
          readTimeMinutes: a.readTimeMinutes,
          viewCount: a.viewCount,
          seoTitle: a.title,
          seoDescription: a.tldr.join(" "),
          publishedAt: new Date(a.publishedAt),
        })
        .returning({ id: articles.id });

      if (a.sources.length > 0) {
        await db.insert(articleSources).values(
          a.sources.map((src) => ({
            articleId: inserted.id,
            sourceId: sourceIdByName.get(src.name) ?? null,
            name: src.name,
            url: src.url,
          })),
        );
      }
    }

    console.log(
      `✓ Tayyor: ${seedArticles.length} ta maqola, ${insertedSources.length} ta manba qo'shildi.`,
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Seed xatosi:", error);
  process.exit(1);
});
