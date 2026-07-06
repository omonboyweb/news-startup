import { articleHref } from "@/lib/categories";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Article } from "@/lib/types";

/** Schema.org NewsArticle JSON-LD for a single article page. */
export function buildNewsArticleSchema(article: Article) {
  const url = `${SITE_URL}${articleHref(article)}`;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.tldr.join(" "),
    image: [article.imageUrl],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    inLanguage: "uz",
    articleSection: article.category,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    // Manba attribution â E-E-A-T signali (TZ 2/8).
    ...(article.sources.length > 0 && {
      citation: article.sources.map((source) => ({
        "@type": "CreativeWork",
        name: source.name,
        url: source.url,
      })),
    }),
  } as const;
}
