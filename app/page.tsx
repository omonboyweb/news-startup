import Image from "next/image";
import Link from "next/link";
import { Clock, TrendingUp } from "lucide-react";

import { NewsCard } from "@/components/news-card";
import { TLDRBlock } from "@/components/tldr-block";
import { Badge } from "@/components/ui/badge";
import { articleHref } from "@/lib/categories";
import { getMostReadArticles, getPublishedArticles } from "@/lib/db/queries";
import { formatTimeAgo, regionLabel } from "@/lib/format";
import { shimmerPlaceholder } from "@/lib/image-placeholder";
import { localizeArticle, tr } from "@/lib/script";
import { getScript } from "@/lib/script-server";
import { CATEGORIES, REGIONS, type Category, type Region } from "@/lib/types";

interface HomePageProps {
  searchParams: Promise<{ category?: string; region?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const category = CATEGORIES.includes(params.category as Category)
    ? (params.category as Category)
    : undefined;
  const region = REGIONS.includes(params.region as Region)
    ? (params.region as Region)
    : undefined;

  const script = await getScript();
  const [rawFiltered, rawMostRead] = await Promise.all([
    getPublishedArticles({ category, region }),
    getMostReadArticles(5),
  ]);
  const filtered = rawFiltered.map((a) => localizeArticle(a, script));
  const mostRead = rawMostRead.map((a) => localizeArticle(a, script));
  const [featured, ...feed] = filtered;

  if (!featured) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-lg font-semibold tracking-tight">
          {tr("Tanlangan filtr bo'yicha maqola topilmadi", script)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {tr("Boshqa rukn yoki hududni tanlab ko'ring.", script)}
        </p>
        <Link
          href="/"
          className="mt-6 text-sm font-medium underline underline-offset-4"
        >
          {tr("Barcha yangiliklarga qaytish", script)}
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-14">
          <Link
            href={articleHref(featured)}
            className="group relative block aspect-16/10 overflow-hidden rounded-xl border bg-muted"
          >
            <Image
              src={featured.imageUrl}
              alt={featured.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={shimmerPlaceholder(1200, 750)}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </Link>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Badge>{tr(featured.category, script)}</Badge>
              <span className="text-sm text-muted-foreground">
                {tr(regionLabel(featured.region), script)}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-balance md:text-4xl xl:text-[2.75rem]">
              <Link
                href={articleHref(featured)}
                className="transition-colors hover:text-foreground/80"
              >
                {featured.title}
              </Link>
            </h1>

            <TLDRBlock points={featured.tldr} script={script} />

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden="true" />
                {featured.readTime} {tr("daqiqa o'qish", script)}
              </span>
              <span aria-hidden="true">·</span>
              <time dateTime={featured.publishedAt}>
                {tr(formatTimeAgo(featured.publishedAt), script)}
              </time>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold tracking-tight">
            {tr(category ?? "So'nggi yangiliklar", script)}
          </h2>

          {feed.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {feed.map((article) => (
                <NewsCard key={article.id} article={article} script={script} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              {tr("Bu bo'limda hozircha boshqa maqolalar yo'q.", script)}
            </p>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="rounded-xl border p-5 lg:sticky lg:top-24">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">
              <TrendingUp className="size-4" aria-hidden="true" />
              {tr("Eng ko'p o'qilgan", script)}
            </h2>
            <ol className="mt-2 divide-y">
              {mostRead.map((article, index) => (
                <li key={article.id}>
                  <Link
                    href={articleHref(article)}
                    className="group flex gap-3 py-3.5"
                  >
                    <span className="text-lg font-bold tabular-nums leading-none text-muted-foreground/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="space-y-1">
                      <p className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-foreground/70">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tr(article.category, script)} ·{" "}
                        {tr(formatTimeAgo(article.publishedAt), script)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>
    </>
  );
}
