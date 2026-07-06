# AuraNews — AI asosidagi yangiliklar portali

AI yordamida (odam nazorati ostida) yangiliklarni yig'uvchi, klasterlaydigan va
o'zbek tilida qayta yozuvchi axborot portali. Bu repozitoriy TZ v2.0 bo'yicha
bosqichma-bosqich quriladi.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui ·
**PostgreSQL + Drizzle ORM** · Lucide React

## Ishga tushirish

### 1. Paketlar

```bash
npm install
```

### 2. Ma'lumotlar bazasi

Postgres kerak (Neon, Supabase yoki lokal). Bepul variant — [neon.tech](https://neon.tech):
yangi project oching va "Connection string" (pooled) ni nusxa oling.

`.env.example` dan `.env` yarating va `DATABASE_URL` ni to'ldiring:

```bash
cp .env.example .env
# .env ichida DATABASE_URL="postgresql://..." ni qo'ying
```

Sxemani bazaga yozing va demo ma'lumotni yuklang:

```bash
npm run db:push    # sxemani bazaga qo'llaydi (dev uchun tez yo'l)
npm run db:seed    # 11 ta demo maqola + manbalarni yuklaydi
```

### 3. Dev server

```bash
npm run dev
```

So'ng `http://localhost:3000` ni oching.

## DB skriptlari

| Buyruq | Vazifa |
|---|---|
| `npm run db:push` | Sxemani migratsiyasiz to'g'ridan-to'g'ri bazaga qo'llaydi (dev) |
| `npm run db:generate` | Sxemadan SQL migratsiya generatsiya qiladi (`lib/db/migrations/`) |
| `npm run db:migrate` | Generatsiya qilingan migratsiyalarni qo'llaydi (prod) |
| `npm run db:seed` | Demo ma'lumotni yuklaydi (idempotent — eskisini tozalaydi) |
| `npm run db:studio` | Drizzle Studio (bazani brauzerda ko'rish) |
| `npm run ingest` | RSS manbalardan xom yangiliklarni yig'adi (`raw_items`) |
| `npm run dedup` | Xom elementlarni embedding qilib klasterlaydi (pgvector) |
| `npm run generate [n]` | Klasterlardan DeepSeek bilan `draft` maqola yaratadi |

Pipeline'ni HTTP orqali ham triggerlash mumkin (keyinroq Inngest/cron uchun):
`POST /api/ingest`, `POST /api/dedup`, `POST /api/generate` (`INGEST_SECRET`
o'rnatilgan bo'lsa `Authorization: Bearer <secret>`).

To'liq pipeline: `npm run ingest && npm run dedup && npm run generate`.

## Muharrir paneli (`/admin`)

`.env` da `ADMIN_PASSWORD` ni belgilang, so'ng `http://localhost:3000/admin`
ga kiring. AI yaratgan maqolalar `draft` bo'lib keladi va saytda ko'rinmaydi;
muharrir **Tasdiqlash** (chop etish), **Tahrirlash** yoki **Rad etish** qiladi.
Siyosat ruknidagi maqolalar "yuqori xavf" deb belgilanadi (TZ 4.4).

## Struktura

| Yo'l | Tavsif |
|---|---|
| `lib/db/schema.ts` | Drizzle sxemasi: `sources`, `articles`, `article_sources` + enumlar |
| `lib/db/index.ts` | DB client (postgres-js, server-only) |
| `lib/db/queries.ts` | Chop etilgan maqolalarni o'qish (DB → view-model) |
| `lib/ingest/rss.ts` | RSS yig'ish (fetch + parse + idempotent saqlash) |
| `lib/dedup/embeddings.ts` | Gemini embedding (gemini-embedding-001, 768D) |
| `lib/dedup/cluster.ts` | Cosine o'xshashlik bo'yicha klasterlash (pgvector) |
| `lib/generate/article.ts` | DeepSeek bilan draft maqola generatsiyasi (TZ 4.3) |
| `app/api/{ingest,dedup,generate}/route.ts` | Pipeline trigger route'lari (secret) |
| `app/admin/*` | Muharrir paneli: moderatsiya navbati + tahrirlash (TZ 4.4) |
| `lib/admin/*` | Admin auth (parol/cookie) + server actions (approve/reject/save) |
| `lib/transliterate.ts` | O'zbek lotin → kirill transliteratsiya dvigateli |
| `lib/script.ts`, `lib/script-server.ts` | Alifbo tanlash (cookie) + `tr()` yordamchisi |
| `app/sitemap.ts`, `app/robots.ts` | Sitemap + robots.txt |
| `app/rss.xml`, `app/news-sitemap.xml` | Chiquvchi RSS + Google News sitemap |
| `lib/types.ts` | Frontend view-model turlari (`Article`, `Category` ...) |
| `scripts/seed.ts` | Seed skripti + `scripts/seed-data.ts` demo kontenti |
| `app/page.tsx` | Bosh sahifa: Hero + lenta + "Eng ko'p o'qilgan" |
| `app/news/[category]/[slug]/page.tsx` | Maqola sahifasi (DB'dan, canonical redirect + 404) |
| `components/article/article-sources.tsx` | "Manbalar" bloki (attribution — TZ 2/8) |

Rukn/hudud filtri URL query orqali server-side ishlaydi:
`/?category=Sport&region=Uzbekistan`.

## Holat (roadmap)

- ✅ **1-qadam:** DB poydevori (Postgres + Drizzle), status/risk-level, manba attribution
- ✅ **2-qadam:** RSS ingestion (`raw_items`, idempotent, UzA + Gazeta.uz jonli feed)
- ✅ **3-qadam:** Deduplication (Gemini embedding + pgvector, cosine ≥ 0.85, `clusters`)
- ✅ **4-qadam:** AI generatsiya (DeepSeek + Vercel AI SDK, `draft` maqola + attribution + ziddiyat flag)
- ✅ **5-qadam:** `/admin` muharrir paneli (parol-himoya, approve/edit/reject, human-in-the-loop)
- ✅ **7a-qadam:** Lotin/Kirill switcher (server-side transliteratsiya, cookie, `<html lang>`)
- ✅ **7b-1:** Sitemap + Google News sitemap + chiquvchi RSS + robots.txt
- ⬜ 6-qadam: Inngest pipeline (orkestratsiya)
- ⬜ 7b-2: Telegram avtopost

> Eslatma: Lotin/Kirill hozircha cookie asosida (bir xil URL). TZ'dagi alohida
> `/uz` va `/uz-cyrl` indekslanadigan route'lar â Faza 2 SEO takomillashtirishi.
