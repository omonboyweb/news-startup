import type { Article, Category } from "@/lib/types";

export type CategorySlug =
  | "siyosat"
  | "iqtisodiyot"
  | "sport"
  | "texnologiya"
  | "ilm-fan";

export const CATEGORY_SLUGS: Record<Category, CategorySlug> = {
  Siyosat: "siyosat",
  Iqtisodiyot: "iqtisodiyot",
  Sport: "sport",
  Texnologiya: "texnologiya",
  "Ilm-fan": "ilm-fan",
};

export const CATEGORY_BY_SLUG: Record<CategorySlug, Category> = {
  siyosat: "Siyosat",
  iqtisodiyot: "Iqtisodiyot",
  sport: "Sport",
  texnologiya: "Texnologiya",
  "ilm-fan": "Ilm-fan",
};

export function categoryToSlug(category: Category): CategorySlug {
  return CATEGORY_SLUGS[category];
}

export function slugToCategory(slug: string): Category | undefined {
  return CATEGORY_BY_SLUG[slug as CategorySlug];
}

/** Canonical article URL: /news/{category-slug}/{article-id}. */
export function articleHref(article: Pick<Article, "id" | "category">): string {
  return `/news/${categoryToSlug(article.category)}/${article.id}`;
}
