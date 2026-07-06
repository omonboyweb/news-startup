"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  endAdminSession,
  requireAdmin,
  startAdminSession,
  verifyPassword,
} from "@/lib/admin/auth";
import { categoryToSlug } from "@/lib/categories";
import { db } from "@/lib/db";
import {
  getModerationArticleById,
  publishArticle,
  rejectArticle,
  unpublishArticle,
  updateArticleContent,
} from "@/lib/db/admin";
import { notifyArticlePublished } from "@/lib/inngest/client";
import { CATEGORIES, REGIONS, type Category, type Region } from "@/lib/types";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password && verifyPassword(password)) {
    await startAdminSession();
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export async function logoutAction() {
  await endAdminSession();
  redirect("/admin/login");
}

function revalidatePublished(row?: { slug: string; category: Category }) {
  revalidatePath("/admin");
  revalidatePath("/");
  if (row) {
    const categorySlug = categoryToSlug(row.category);
    revalidatePath(`/news/${categorySlug}`);
    revalidatePath(`/news/${categorySlug}/${row.slug}`);
  }
}

export async function approveAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const row = await publishArticle(db, id);
  await notifyArticlePublished(id);
  revalidatePublished(row);
}

export async function rejectAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await rejectArticle(db, id);
  revalidatePath("/admin");
}

export async function unpublishAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const row = await unpublishArticle(db, id);
  revalidatePublished(row);
}

export async function saveAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  // Tahrirdan oldingi holat: chop etilgan maqolada eski URL'ni ham
  // revalidate qilish uchun kerak (rukn o'zgarsa URL o'zgaradi).
  const before = await getModerationArticleById(db, id);

  const category = String(formData.get("category") ?? "") as Category;
  const region = String(formData.get("region") ?? "") as Region;
  const tldr = String(formData.get("tldr") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 5);

  await updateArticleContent(db, id, {
    title: String(formData.get("title") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    tldr,
    category: CATEGORIES.includes(category) ? category : undefined,
    region: REGIONS.includes(region) ? region : undefined,
    seoTitle: String(formData.get("seoTitle") ?? "").trim() || null,
    seoDescription: String(formData.get("seoDescription") ?? "").trim() || null,
  });

  let published: Awaited<ReturnType<typeof publishArticle>> | undefined;
  if (formData.get("publish")) {
    published = await publishArticle(db, id);
    await notifyArticlePublished(id);
  }

  const wasPublished = before?.status === "published";
  if (wasPublished) {
    revalidatePublished({ slug: before.slug, category: before.category });
    const newCategory = CATEGORIES.includes(category)
      ? category
      : before.category;
    revalidatePublished({ slug: before.slug, category: newCategory });
  } else {
    revalidatePublished(published);
  }

  redirect(wasPublished ? "/admin?tab=published" : "/admin");
}
