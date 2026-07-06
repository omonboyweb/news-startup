import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatDate, regionLabel } from "@/lib/format";
import { tr, type Script } from "@/lib/script";
import type { Article } from "@/lib/types";

interface ArticleHeaderProps {
  article: Article;
  script: Script;
}

export function ArticleHeader({ article, script }: ArticleHeaderProps) {
  return (
    <header>
      <div className="flex items-center gap-2">
        <Badge>{tr(article.category, script)}</Badge>
        <span className="text-sm text-muted-foreground">
          {tr(regionLabel(article.region), script)}
        </span>
      </div>

      <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">
        {article.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span>{tr("AuraNews tahririyati", script)}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={article.publishedAt}>
          {tr(formatDate(article.publishedAt), script)}
        </time>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden="true" />
          {article.readTime} {tr("daqiqa o'qish", script)}
        </span>
      </div>
    </header>
  );
}
