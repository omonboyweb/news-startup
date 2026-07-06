import Link from "next/link";
import { Suspense } from "react";

import { CategoryNav } from "@/components/category-nav";
import { RegionSelector } from "@/components/region-selector";
import { ScriptSwitcher } from "@/components/script-switcher";
import type { Script } from "@/lib/script";

export function Header({ script }: { script: Script }) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
            A
          </span>
          <span className="text-lg font-semibold tracking-tight">AuraNews</span>
        </Link>

        <Suspense>
          <CategoryNav script={script} className="hidden lg:flex" />
        </Suspense>

        <div className="flex shrink-0 items-center gap-2">
          <ScriptSwitcher script={script} />
          <Suspense fallback={<div className="h-8 w-40" />}>
            <RegionSelector script={script} />
          </Suspense>
        </div>
      </div>

      <div className="border-t lg:hidden">
        <Suspense>
          <CategoryNav
            script={script}
            className="flex overflow-x-auto px-4 py-2 sm:px-6 scrollbar-none [&::-webkit-scrollbar]:hidden"
          />
        </Suspense>
      </div>
    </header>
  );
}
