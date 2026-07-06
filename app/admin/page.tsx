import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Check, ExternalLink, Pencil, Undo2, X } from "lucide-react";

import {
  approveAction,
  logoutAction,
  rejectAction,
  unpublishAction,
} from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { categoryToSlug } from "@/lib/categories";
import { db } from "@/lib/db";
import { getDraftArticles, getPublishedArticlesForAdmin } from "@/lib/db/admin";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Moderatsiya navbati · Admin",
  robots: { index: false, follow: false },
};

interface AdminPageProps {
  searchParams: Promise<{ tab?: string }>;
}

const tabLink = (active: boolean) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    active
      ? "bg-foreground text-background"
      : "text-muted-foreground hover:bg-accent hover:text-foreground"
  }`;

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await requireAdmin();
  const { tab } = await searchParams;
  const showPublished = tab === "published";
  const items = showPublished
    ? await getPublishedArticlesForAdmin(db)
    : await getDraftArticles(db);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {showPublished ? "Saytdagi maqolalar" : "Moderatsiya navbati"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {showPublished
              ? `${items.length} ta maqola saytda chop etilgan.`
              : `${items.length} ta draft muharrir tasdig'ini kutmoqda.`}
          </p>
        </div>
        <form action={logoutAction}>
          <button className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Chiqish
          </button>
        </form>
      </div>

      <nav className="mt-6 flex gap-1 rounded-xl border p-1">
        <Link href="/admin" className={tabLink(!showPublished)}>
          Navbat
        </Link>
        <Link href="/admin?tab=published" className={tabLink(showPublished)}>
          Chop etilgan
        </Link>
      </nav>

      {items.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          {showPublished ? (
            <>Saytda hali chop etilgan maqola yo&apos;q.</>
          ) : (
            <>
              Navbat bo&apos;sh. Yangi draftlar uchun pipeline&apos;ni ishga
              tushiring (
              <code className="rounded bg-muted px-1">npm run generate</code>).
            </>
          )}
        </p>
      ) : showPublished ? (
        <div className="mt-8 space-y-4">
          {items.map((article) => {
            const href = `/news/${categoryToSlug(article.category)}/${article.slug}`;
            return (
              <article key={article.id} className="rounded-xl border p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">
                    {article.category}
                  </span>
                  <span className="text-muted-foreground">{article.region}</span>
                  <span className="ml-auto text-muted-foreground">
                    {article.publishedAt
                      ? formatDate(article.publishedAt)
                      : formatDate(article.createdAt)}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
                  {article.title}
                </h2>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/${article.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                    Tahrirlash
                  </Link>

                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                    Saytda ko&apos;rish
                  </a>

                  <form action={unpublishAction}>
                    <input type="hidden" name="id" value={article.id} />
                    <button className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40">
                      <Undo2 className="size-4" aria-hidden="true" />
                      Saytdan olish
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {items.map((article) => (
            <article key={article.id} className="rounded-xl border p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">
                  {article.category}
                </span>
                <span className="text-muted-foreground">{article.region}</span>
                {article.riskLevel === "high" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <AlertTriangle className="size-3" aria-hidden="true" />
                    Yuqori xavf — pre-moderatsiya
                  </span>
                ) : null}
                <span className="ml-auto text-muted-foreground">
                  {formatDate(article.createdAt)}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
                {article.title}
              </h2>

              <ul className="mt-3 space-y-1.5">
                {article.tldr.map((point) => (
                  <li key={point} className="flex gap-2 text-sm text-foreground/90">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground" />
                    {point}
                  </li>
                ))}
              </ul>

              {article.editorialNotes.length > 0 ? (
                <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/40">
                  <p className="flex items-center gap-1.5 font-medium text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="size-3.5" aria-hidden="true" />
                    Manbalar orasidagi ziddiyatlar (AI belgiladi):
                  </p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-amber-900 dark:text-amber-200">
                    {article.editorialNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {article.content}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="font-medium">Manbalar:</span>
                {article.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    {source.name}
                  </a>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <form action={approveAction}>
                  <input type="hidden" name="id" value={article.id} />
                  <button className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
                    <Check className="size-4" aria-hidden="true" />
                    Tasdiqlash
                  </button>
                </form>

                <Link
                  href={`/admin/${article.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  <Pencil className="size-4" aria-hidden="true" />
                  Tahrirlash
                </Link>

                <form action={rejectAction}>
                  <input type="hidden" name="id" value={article.id} />
                  <button className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40">
                    <X className="size-4" aria-hidden="true" />
                    Rad etish
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
