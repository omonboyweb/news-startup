import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { isNotNull } from "drizzle-orm";
import Parser from "rss-parser";

import * as schema from "@/lib/db/schema";
import { rawItems, sources, type NewRawItemRow, type SourceRow } from "@/lib/db/schema";

// db'ni parametr sifatida qabul qilamiz: route "server-only" clientni,
// CLI skript esa o'z clientini uzatadi (server-only'ga bog'lanmaslik uchun).
type IngestDb = PostgresJsDatabase<typeof schema>;

const FETCH_TIMEOUT_MS = 15_000;
const USER_AGENT = "AuraNewsBot/0.1 (+https://auranews.uz)";

const parser = new Parser();

// Feed'ni native fetch bilan olamiz: AbortSignal.timeout soketni haqiqatan
// uzadi (rss-parser'ning ichki timeout'i ba'zan osilib qolardi va CLI toza
// chiqmasdi). Keyin XML'ni parseString bilan tahlil qilamiz.
async function fetchFeed(feedUrl: string) {
  const response = await fetch(feedUrl, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    redirect: "follow",
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
    },
  });

  if (!response.ok) {
    throw new Error(`Status code ${response.status}`);
  }

  return parser.parseString(await response.text());
}

export interface SourceIngestResult {
  source: string;
  fetched: number;
  inserted: number;
  error?: string;
}

export interface IngestSummary {
  startedAt: string;
  durationMs: number;
  totalInserted: number;
  sources: SourceIngestResult[];
}

/** Feed elementini xom yozuvga aylantiradi (yaroqsizlarni tashlab yuboradi). */
function toRawItem(
  sourceId: string,
  item: Parser.Item,
): NewRawItemRow | null {
  const url = item.link?.trim();
  const title = item.title?.trim();
  if (!url || !title) {
    return null;
  }

  const publishedAt = item.isoDate ? new Date(item.isoDate) : null;

  return {
    sourceId,
    guid: (item.guid ?? url).trim(),
    url,
    title,
    summary: item.contentSnippet?.trim() ?? null,
    // rss-parser `content` maydoniga content:encoded yoki description'ni joylaydi.
    content: item.content?.trim() ?? null,
    publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime())
      ? publishedAt
      : null,
  };
}

/** Bitta manbaning feed'ini yig'ib, yangi elementlarni saqlaydi (idempotent). */
export async function ingestSource(
  db: IngestDb,
  source: Pick<SourceRow, "id" | "name" | "feedUrl">,
): Promise<SourceIngestResult> {
  if (!source.feedUrl) {
    return { source: source.name, fetched: 0, inserted: 0 };
  }

  try {
    const feed = await fetchFeed(source.feedUrl);

    const rows = feed.items
      .map((item) => toRawItem(source.id, item))
      .filter((row): row is NewRawItemRow => row !== null);

    if (rows.length === 0) {
      return { source: source.name, fetched: feed.items.length, inserted: 0 };
    }

    // (source_id, guid) unikal â mavjud elementlar jimgina o'tkazib yuboriladi.
    const inserted = await db
      .insert(rawItems)
      .values(rows)
      .onConflictDoNothing({ target: [rawItems.sourceId, rawItems.guid] })
      .returning({ id: rawItems.id });

    return {
      source: source.name,
      fetched: feed.items.length,
      inserted: inserted.length,
    };
  } catch (error) {
    return {
      source: source.name,
      fetched: 0,
      inserted: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/** feedUrl'i mavjud barcha manbalarni yig'adi (bittasi yiqilsa boshqalari davom etadi). */
export async function ingestAllSources(db: IngestDb): Promise<IngestSummary> {
  const startedAt = Date.now();

  const feedSources = await db
    .select({ id: sources.id, name: sources.name, feedUrl: sources.feedUrl })
    .from(sources)
    .where(isNotNull(sources.feedUrl));

  const results = await Promise.all(
    feedSources.map((source) => ingestSource(db, source)),
  );

  return {
    startedAt: new Date(startedAt).toISOString(),
    durationMs: Date.now() - startedAt,
    totalInserted: results.reduce((sum, r) => sum + r.inserted, 0),
    sources: results,
  };
}
