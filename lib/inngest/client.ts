import { Inngest, eventType, staticSchema } from "inngest";

// TZ 1: pipeline eventlari tiplangan — noto'g'ri payload compile-time'da ushlansin.

/** Muharrir approve qilganda yuboriladi (Telegram avtopost trigger'i). */
export const articlePublishedEvent = eventType("article/published", {
  schema: staticSchema<{ articleId: string }>(),
});

/** Pipeline'ni qo'lda ishga tushirish uchun (cron'dan tashqari). */
export const pipelineRunEvent = eventType("pipeline/run");

export const inngest = new Inngest({ id: "auranews" });

/**
 * Publish bo'lgan maqola haqida event yuboradi. Inngest yetib bo'lmas holatda
 * bo'lsa ham publish muvaffaqiyatli qolishi kerak — shuning uchun xatoni
 * yutib, faqat logga yozamiz (telegram_posted_at null qolgani uchun postni
 * keyin qayta-approve orqali yuborsa bo'ladi).
 */
export async function notifyArticlePublished(articleId: string): Promise<void> {
  try {
    await inngest.send(articlePublishedEvent.create({ articleId }));
  } catch (error) {
    console.error(
      `[telegram] article/published eventi yuborilmadi (articleId=${articleId}):`,
      error instanceof Error ? error.message : error,
    );
  }
}
