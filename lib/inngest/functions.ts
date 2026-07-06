import { NonRetriableError, cron } from "inngest";
import { eq } from "drizzle-orm";

import { categoryToSlug } from "@/lib/categories";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { clusterNewItems } from "@/lib/dedup/cluster";
import { generateDrafts } from "@/lib/generate/article";
import { ingestAllSources } from "@/lib/ingest/rss";
import {
  articlePublishedEvent,
  inngest,
  pipelineRunEvent,
} from "@/lib/inngest/client";
import { isTelegramConfigured, sendArticleToChannel } from "@/lib/telegram";

// TZ 4: yangilik chiqishidan publish'gacha < 30 daqiqa mezoniga mos ritm.
const PIPELINE_CRON = "*/30 * * * *";

// Bir siklda nechta klasterdan maqola generatsiya qilinadi (xarajat nazorati).
const GENERATE_LIMIT = 5;

/**
 * TZ 1: ko'p bosqichli pipeline — har step alohida retry qilinadi, biri
 * yiqilsa oldingi steplar qayta ishlamaydi (Inngest step memoization).
 * Cron avtomatik yuritadi; "pipeline/run" eventi qo'lda trigger uchun.
 */
export const newsPipeline = inngest.createFunction(
  {
    id: "news-pipeline",
    retries: 2,
    triggers: [cron(PIPELINE_CRON), pipelineRunEvent],
  },
  async ({ step }) => {
    const ingest = await step.run("ingest", () => ingestAllSources(db));
    const dedup = await step.run("dedup", () => clusterNewItems(db));
    const generate = await step.run("generate", () =>
      generateDrafts(db, { limit: GENERATE_LIMIT }),
    );
    return { ingest, dedup, generate };
  },
);

/**
 * TZ 5: muharrir approve qilgach kanalga avtopost. telegram_posted_at orqali
 * idempotent — retry yoki qayta-approve'da dublikat post ketmaydi.
 */
export const telegramAutopost = inngest.createFunction(
  { id: "telegram-autopost", retries: 3, triggers: [articlePublishedEvent] },
  async ({ event, step }) => {
    const { articleId } = event.data as { articleId: string };

    const article = await step.run("load-article", async () => {
      const row = await db.query.articles.findFirst({
        where: eq(articles.id, articleId),
        columns: {
          id: true,
          slug: true,
          title: true,
          tldr: true,
          category: true,
          status: true,
          telegramPostedAt: true,
        },
      });
      if (!row) return null;
      return { ...row, telegramPostedAt: row.telegramPostedAt?.toISOString() ?? null };
    });

    if (!article) {
      throw new NonRetriableError(`Maqola topilmadi: ${articleId}`);
    }
    if (article.status !== "published") {
      return { skipped: `status=${article.status} — publish emas` };
    }
    if (article.telegramPostedAt) {
      return { skipped: `allaqachon yuborilgan (${article.telegramPostedAt})` };
    }
    if (!isTelegramConfigured()) {
      return { skipped: "TELEGRAM_CHANNEL_ID sozlanmagan — avtopost o'chiq" };
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const url = `${siteUrl}/news/${categoryToSlug(article.category)}/${article.slug}`;

    const sent = await step.run("send-telegram", () =>
      sendArticleToChannel({ title: article.title, tldr: article.tldr, url }),
    );

    await step.run("mark-posted", () =>
      db
        .update(articles)
        .set({ telegramPostedAt: new Date() })
        .where(eq(articles.id, articleId)),
    );

    return { messageId: sent.messageId, url };
  },
);
