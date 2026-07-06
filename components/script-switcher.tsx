"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { SCRIPT_COOKIE, type Script } from "@/lib/script";
import { cn } from "@/lib/utils";

const ONE_YEAR = 60 * 60 * 24 * 365;

export function ScriptSwitcher({ script }: { script: Script }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function selectScript(next: Script) {
    if (next === script) return;
    document.cookie = `${SCRIPT_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    startTransition(() => router.refresh());
  }

  const buttonClass = (active: boolean) =>
    cn(
      "px-2 py-1 text-xs font-medium transition-colors",
      active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
    );

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center overflow-hidden rounded-md border",
        isPending && "opacity-60",
      )}
      role="group"
      aria-label="Alifbo"
    >
      <button
        type="button"
        onClick={() => selectScript("latn")}
        aria-pressed={script === "latn"}
        className={buttonClass(script === "latn")}
      >
        Lot
      </button>
      <button
        type="button"
        onClick={() => selectScript("cyrl")}
        aria-pressed={script === "cyrl"}
        className={cn(buttonClass(script === "cyrl"), "border-l")}
      >
        Кир
      </button>
    </div>
  );
}
