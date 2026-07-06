import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { saveAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { db } from "@/lib/db";
import { getModerationArticleById } from "@/lib/db/admin";
import { CATEGORIES, REGIONS } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tahrirlash · Admin",
  robots: { index: false, follow: false },
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

const field = "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40";

export default async function EditArticlePage({ params }: EditPageProps) {
  await requireAdmin();
  const { id } = await params;
  const article = await getModerationArticleById(db, id);
  if (!article) {
    notFound();
  }
  const isPublished = article.status === "published";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={isPublished ? "/admin?tab=published" : "/admin"}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {isPublished ? "Saytdagi maqolalarga qaytish" : "Navbatga qaytish"}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Maqolani tahrirlash</h1>
        {isPublished ? (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-300">
            Saytda chop etilgan
          </span>
        ) : null}
      </div>
      {isPublished ? (
        <p className="mt-1 text-sm text-muted-foreground">
          Saqlangan o&apos;zgarishlar saytda darhol yangilanadi.
        </p>
      ) : null}

      <form action={saveAction} className="mt-6 space-y-5">
        <input type="hidden" name="id" value={article.id} />

        <div className="space-y-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            Sarlavha
          </label>
          <input id="title" name="title" defaultValue={article.title} className={field} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="category" className="text-sm font-medium">
              Rukn
            </label>
            <select id="category" name="category" defaultValue={article.category} className={field}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="region" className="text-sm font-medium">
              Hudud
            </label>
            <select id="region" name="region" defaultValue={article.region} className={field}>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r === "Uzbekistan" ? "O'zbekiston" : "Jahon"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="tldr" className="text-sm font-medium">
            TL;DR (har qatorda bitta tezis)
          </label>
          <textarea
            id="tldr"
            name="tldr"
            rows={3}
            defaultValue={article.tldr.join("\n")}
            className={field}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="content" className="text-sm font-medium">
            Matn (paragraflar bo&apos;sh qator bilan ajratiladi)
          </label>
          <textarea
            id="content"
            name="content"
            rows={16}
            defaultValue={article.content}
            className={`${field} font-mono text-xs leading-relaxed`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="seoTitle" className="text-sm font-medium">
              SEO sarlavha
            </label>
            <input
              id="seoTitle"
              name="seoTitle"
              defaultValue={article.seoTitle ?? ""}
              className={field}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="seoDescription" className="text-sm font-medium">
              SEO tavsif
            </label>
            <input
              id="seoDescription"
              name="seoDescription"
              defaultValue={article.seoDescription ?? ""}
              className={field}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t pt-5">
          {isPublished ? (
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Saqlash (saytda yangilanadi)
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                Saqlash (draft)
              </button>
              <button
                type="submit"
                name="publish"
                value="1"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Saqlash va chop etish
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
