import { toCyrillic } from "@/lib/transliterate";
import type { Article } from "@/lib/types";

export type Script = "latn" | "cyrl";

export const SCRIPT_COOKIE = "script";
export const DEFAULT_SCRIPT: Script = "latn";

/** Matnni tanlangan alifboga o'giradi (latn'da o'zgarishsiz). */
export function tr(text: string, script: Script): string {
  return script === "cyrl" ? toCyrillic(text) : text;
}

/** Maqola matn maydonlarini transliteratsiya qiladi (manba nomlariga tegmaydi). */
export function localizeArticle(article: Article, script: Script): Article {
  if (script === "latn") return article;
  return {
    ...article,
    title: toCyrillic(article.title),
    tldr: article.tldr.map(toCyrillic),
    content: toCyrillic(article.content),
  };
}
