import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { articleHref } from "@/lib/categories";
import { formatTimeAgo, regionLabel } from "@/lib/format";
import { shimmerPlaceholder } from "@/lib/image-placeholder";
import { tr, type Script } from "@/lib/script";
import type { Article } from "@/lib/types";

interface NewsCardProps {
  article: Article;
  script: Script;
}

export function NewsCard({ article, script }: NewsCardProps) {
  const summary = article.content.split("\n\n")[0];

  return (
    <Link
      href={articleHref(article)}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/30"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={shimmerPlaceholder(600, 375)}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{tr(article.category, script)}</Badge>
          <span className="text-xs text-muted-foreground">
            {tr(regionLabel(article.region), script)}
          </span>
        </div>

        <h3 className="line-clamp-2 font-semibold leading-snug tracking-tight text-balance">
          {article.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {summary}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden="true" />
            {article.readTime} {tr("daqiqa", script)}
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.publishedAt}>
            {tr(formatTimeAgo(article.publishedAt), script)}
          </time>
        </div>
      </div>
    </Link>
  );
}
