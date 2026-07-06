// Frontend "view model" turlari. DB satrlari (lib/db/schema.ts) shu shaklga
// map qilinadi (lib/db/queries.ts), shu bilan komponentlar DB tafsilotlaridan
// mustaqil qoladi.

export type Category =
  | "Siyosat"
  | "Iqtisodiyot"
  | "Sport"
  | "Texnologiya"
  | "Ilm-fan";

export type Region = "Uzbekistan" | "Jahon";

export type ArticleStatus = "draft" | "published" | "rejected";

export type RiskLevel = "low" | "high";

export const CATEGORIES: Category[] = [
  "Siyosat",
  "Iqtisodiyot",
  "Sport",
  "Texnologiya",
  "Ilm-fan",
];

export const REGIONS: Region[] = ["Uzbekistan", "Jahon"];

/** Maqola ostidagi manba havolasi (TZ 2/8 â attribution majburiy). */
export interface ArticleSource {
  name: string;
  url: string;
}

export interface Article {
  /** Publik slug â URL'da ishlatiladi (`/news/{category}/{id}`). */
  id: string;
  title: string;
  /** AI xulosasi â muharrir tasdiqlagan 3 ta tezis. */
  tldr: string[];
  content: string;
  category: Category;
  region: Region;
  imageUrl: string;
  /** ISO 8601 */
  publishedAt: string;
  /** O'qish vaqti, daqiqalarda. */
  readTime: number;
  /** Manbalar (detal sahifada to'ldiriladi; lentada bo'sh bo'lishi mumkin). */
  sources: ArticleSource[];
}
