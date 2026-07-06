import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ArticleContent } from "@/components/article/article-content";
import { ArticleHeader } from "@/components/article/article-header";
import { ArticleSources } from "@/components/article/article-sources";
import { ShareButtons } from "@/components/article/share-buttons";
import { articleHref, categoryToSlug } from "@/lib/categories";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getPublishedArticleBySlug } from "@/lib/db/queries";
import { buildNewsArticleSchema } from "@/lib/schema";
import { localizeArticle, tr } from "@/lib/script";
import { getScript } from "@/lib/script-server";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) {
    return {};
  }

  const description = article.tldr.join(" ");
  const url = `${SITE_URL}${articleHref(article)}`;

  return {
    title: article.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "uz_UZ",
      publishedTime: article.publishedAt,
      section: article.category,
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 800,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  if (category !== categoryToSlug(article.category)) {
    permanentRedirect(articleHref(article));
  }

  const script = await getScript();
  const view = localizeArticle(article, script);

  const jsonLd = buildNewsArticleSchema(article);
  const shareUrl = `${SITE_URL}${articleHref(article)}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {tr("Barcha yangiliklar", script)}
      </Link>

      <article>
        <ArticleHeader article={view} script={script} />
        <ArticleContent article={view} script={script} />
        <ArticleSources sources={view.sources} script={script} />
        <ShareButtons title={view.title} url={shareUrl} />
      </article>
    </div>
  );
}
