import { articleHref } from "@/lib/categories";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getPublishedArticles } from "@/lib/db/queries";
import { escapeXml } from "@/lib/xml";

export const dynamic = "force-dynamic";

const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000;

export async function GET() {
  const cutoff = Date.now() - NEWS_WINDOW_MS;
  const recent = (await getPublishedArticles())
    .filter((article) => new Date(article.publishedAt).getTime() >= cutoff)
    .slice(0, 1000);

  const urls = recent
    .map((article) => {
      const url = `${SITE_URL}${articleHref(article)}`;
      return `  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>uz</news:language>
      </news:publication>
      <news:publication_date>${new Date(article.publishedAt).toISOString()}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
