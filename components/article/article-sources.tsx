import { ExternalLink } from "lucide-react";

import { tr, type Script } from "@/lib/script";
import type { ArticleSource } from "@/lib/types";

interface ArticleSourcesProps {
  sources: ArticleSource[];
  script: Script;
}

export function ArticleSources({ sources, script }: ArticleSourcesProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="manbalar-heading"
      className="mt-10 rounded-xl border bg-muted/30 p-5"
    >
      <h2
        id="manbalar-heading"
        className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {tr("Manbalar", script)}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {source.name}
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {tr(
          "Ushbu material yuqoridagi manbalar asosida sun'iy intellekt yordamida qayta yozilgan.",
          script,
        )}
      </p>
    </section>
  );
}
