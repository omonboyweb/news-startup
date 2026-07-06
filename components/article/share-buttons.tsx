"use client";

import { useState } from "react";
import { Check, Link as LinkIcon, Send } from "lucide-react";

import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  title: string;
  url: string;
  className?: string;
}

export function ShareButtons({ title, url, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const twitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  const buttonClass =
    "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent";

  return (
    <div
      className={cn(
        "mt-8 flex flex-wrap items-center gap-2 border-t pt-6",
        className,
      )}
    >
      <span className="text-sm font-medium text-muted-foreground">
        Ulashish:
      </span>
      <a
        href={telegramHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
      >
        <Send className="size-3.5" aria-hidden="true" />
        Telegram
      </a>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
      >
        X (Twitter)
      </a>
      <button type="button" onClick={handleCopy} className={buttonClass}>
        {copied ? (
          <Check className="size-3.5" aria-hidden="true" />
        ) : (
          <LinkIcon className="size-3.5" aria-hidden="true" />
        )}
        {copied ? "Nusxalandi" : "Havolani nusxalash"}
      </button>
    </div>
  );
}
