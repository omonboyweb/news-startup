// TZ 5: Telegram distributsiya — maqola publish bo'lganda kanalga avtopost.
// db'siz sof modul: Inngest funksiyasi ham, test skripti ham ishlata oladi.

const API_TIMEOUT_MS = 15_000;

export interface TelegramArticlePost {
  title: string;
  tldr: string[];
  /** Maqolaning to'liq (absolute) URL manzili. */
  url: string;
}

export interface TelegramSendResult {
  messageId: number;
  chatId: string;
}

/** Token ham, kanal ham sozlanganda true. Bo'lmasa avtopost jimgina o'chiq. */
export function isTelegramConfigured(): boolean {
  return Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHANNEL_ID,
  );
}

/** Telegram HTML parse_mode uchun maxsus belgilarni qochiradi. */
function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/** TZ 5 formati: sarlavha + TL;DR tezislar + saytga havola. */
export function buildPostText(post: TelegramArticlePost): string {
  const lines = [`<b>${escapeHtml(post.title)}</b>`, ""];
  for (const point of post.tldr) {
    lines.push(`▪️ ${escapeHtml(point)}`);
  }
  if (post.tldr.length > 0) lines.push("");
  lines.push(`<a href="${escapeHtml(post.url)}">Batafsil o'qish →</a>`);
  return lines.join("\n");
}

/**
 * Maqolani kanalga yuboradi. Xato bo'lsa throw qiladi — retry qarori
 * chaqiruvchi tomonda (Inngest step avtomatik retry qiladi).
 */
export async function sendArticleToChannel(
  post: TelegramArticlePost,
): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  if (!token || !chatId) {
    throw new Error(
      "TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHANNEL_ID o'rnatilmagan (.env.example ga qarang).",
    );
  }

  // Telegram faqat publik URL'ga preview yasay oladi; localhost/http'da
  // WEBPAGE_URL_INVALID qaytaradi — u holda preview'ni o'chirib yuboramiz.
  const isPublicUrl =
    post.url.startsWith("https://") &&
    !/localhost|127\.0\.0\.1/.test(post.url);

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      body: JSON.stringify({
        chat_id: chatId,
        text: buildPostText(post),
        parse_mode: "HTML",
        // Havola preview'i postning pastida chiqsin (sarlavhani bosmasin).
        link_preview_options: isPublicUrl
          ? { url: post.url, prefer_small_media: true }
          : { is_disabled: true },
      }),
    },
  );

  const payload = (await response.json()) as {
    ok: boolean;
    description?: string;
    result?: { message_id: number };
  };

  if (!payload.ok || !payload.result) {
    throw new Error(
      `Telegram sendMessage xatosi: ${payload.description ?? `HTTP ${response.status}`}`,
    );
  }

  return { messageId: payload.result.message_id, chatId };
}
