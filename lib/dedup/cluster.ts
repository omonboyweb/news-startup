import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { and, cosineDistance, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";

import * as schema from "@/lib/db/schema";
import { clusters, rawItems } from "@/lib/db/schema";
import { embedTexts, embeddingInput } from "@/lib/dedup/embeddings";

type DedupDb = PostgresJsDatabase<typeof schema>;

// TZ 4.2: 0.85 boshlang'ich cosine chegarasi (real ma'lumotda A/B bilan sozlanadi).
export const DEFAULT_SIMILARITY_THRESHOLD = 0.85;

export interface DedupSummary {
  processed: number;
  newClusters: number;
  joined: number;
  threshold: number;
}

/**
 * Embeddingi yo'q "new" elementlarni vektorlashtiradi va cosine o'xshashlik
 * bo'yicha mavjud klasterga biriktiradi yoki yangi klaster ochadi.
 *
 * Idempotent: faqat embeddingi yo'q elementlarni oladi. Batch ichida oldinroq
 * biriktirilgan elementlar keyingilariga qidiruv paytida ko'rinadi (o'sha
 * yugurishning o'zida klasterlanadi).
 */
export async function clusterNewItems(
  db: DedupDb,
  options: { threshold?: number; limit?: number } = {},
): Promise<DedupSummary> {
  const threshold = options.threshold ?? DEFAULT_SIMILARITY_THRESHOLD;
  const limit = options.limit ?? 200;

  const items = await db
    .select({
      id: rawItems.id,
      title: rawItems.title,
      summary: rawItems.summary,
    })
    .from(rawItems)
    .where(and(eq(rawItems.status, "new"), isNull(rawItems.embedding)))
    .limit(limit);

  if (items.length === 0) {
    return { processed: 0, newClusters: 0, joined: 0, threshold };
  }

  const vectors = await embedTexts(items.map(embeddingInput));

  let newClusters = 0;
  let joined = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const embedding = vectors[i];

    // Klasterlangan elementlar orasidan eng yaqin qo'shni (cosine o'xshashlik).
    const similarity = sql<number>`1 - (${cosineDistance(rawItems.embedding, embedding)})`;
    const [nearest] = await db
      .select({ clusterId: rawItems.clusterId, similarity })
      .from(rawItems)
      .where(
        and(isNotNull(rawItems.clusterId), isNotNull(rawItems.embedding)),
      )
      .orderBy(desc(similarity))
      .limit(1);

    let clusterId: string;
    if (nearest?.clusterId && nearest.similarity >= threshold) {
      clusterId = nearest.clusterId;
      joined++;
    } else {
      const [created] = await db
        .insert(clusters)
        .values({ representativeTitle: item.title })
        .returning({ id: clusters.id });
      clusterId = created.id;
      newClusters++;
    }

    await db
      .update(rawItems)
      .set({ embedding, clusterId, status: "clustered" })
      .where(eq(rawItems.id, item.id));

    await db
      .update(clusters)
      .set({ itemCount: sql`${clusters.itemCount} + 1`, updatedAt: new Date() })
      .where(eq(clusters.id, clusterId));
  }

  return { processed: items.length, newClusters, joined, threshold };
}
