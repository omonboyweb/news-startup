import { Sparkles } from "lucide-react";

import { tr, type Script } from "@/lib/script";
import { cn } from "@/lib/utils";

interface TLDRBlockProps {
  points: string[];
  script: Script;
  className?: string;
}

export function TLDRBlock({ points, script, className }: TLDRBlockProps) {
  return (
    <div className={cn("rounded-xl border bg-muted/40 p-5", className)}>
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <Sparkles className="size-3.5" aria-hidden="true" />
        {tr("AI xulosasi", script)}
      </p>
      <ul className="mt-3 space-y-2.5">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2.5">
            <span
              className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground"
              aria-hidden="true"
            />
            <span className="text-sm leading-relaxed text-foreground/90">
              {point}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
