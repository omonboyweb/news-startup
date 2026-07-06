"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { tr, type Script } from "@/lib/script";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryNav({
  script,
  className,
}: {
  script: Script;
  className?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = pathname === "/" ? searchParams.get("category") : null;
  const region = searchParams.get("region");

  function hrefFor(category?: string) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (region) params.set("region", region);
    const query = params.toString();
    return query ? `/?${query}` : "/";
  }

  const linkClass = (isActive: boolean) =>
    cn(
      "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-secondary text-foreground"
        : "text-muted-foreground hover:text-foreground",
    );

  return (
    <nav aria-label="Ruknlar" className={cn("items-center gap-1", className)}>
      <Link href={hrefFor()} className={linkClass(activeCategory === null)}>
        {tr("Asosiy", script)}
      </Link>
      {CATEGORIES.map((category) => (
        <Link
          key={category}
          href={hrefFor(category)}
          className={linkClass(activeCategory === category)}
        >
          {tr(category, script)}
        </Link>
      ))}
    </nav>
  );
}
