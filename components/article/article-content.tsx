import Image from "next/image";

import { TLDRBlock } from "@/components/tldr-block";
import { shimmerPlaceholder } from "@/lib/image-placeholder";
import { tr, type Script } from "@/lib/script";
import type { Article } from "@/lib/types";

interface ArticleContentProps {
  article: Article;
  script: Script;
}

export function ArticleContent({ article, script }: ArticleContentProps) {
  const paragraphs = article.content.split("\n\n");

  return (
    <div>
      <TLDRBlock points={article.tldr} script={script} className="mt-8" />

      <figure className="relative mt-8 aspect-video overflow-hidden rounded-xl border bg-muted">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          placeholder="blur"
          blurDataURL={shimmerPlaceholder(1200, 800)}
          className="object-cover"
        />
      </figure>

      <div className="mt-8 space-y-5">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base/7 text-foreground/90">
            {paragraph}
          </p>
        ))}
      </div>

      <p className="mt-10 border-t pt-6 text-sm text-muted-foreground">
        {tr(
          "Ushbu maqola sun'iy intellekt yordamida tayyorlangan va tahririyat tomonidan tasdiqlangan.",
          script,
        )}
      </p>
    </div>
  );
}
