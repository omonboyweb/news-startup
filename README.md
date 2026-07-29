<div align="center">

# 📰 AuraNews

**AI yordamida (odam nazorati ostida) yangiliklarni yig'uvchi, klasterlaydigan va<br/>o'zbek tilida qayta yozuvchi axborot portali.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F)](https://orm.drizzle.team/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-hissa-qoshish)

</div>

---

AuraNews — bir nechta manbadan (RSS) yig'ilgan yangilik xabarlarini avtomatik
ravishda klasterlaydigan, sun'iy intellekt yordamida o'zbek tilida qayta
yozadigan va inson muharriri tasdig'idan o'tgach chop etadigan axborot
portali. Loyiha TZ v2.0 texnik topshirig'i asosida bosqichma-bosqich
quriladi va ochiq manba (open source) sifatida rivojlantiriladi.

## 📑 Mundarija

- [Xususiyatlar](#-xususiyatlar)
- [Texnologiyalar](#-texnologiyalar)
- [Arxitektura (pipeline)](#-arxitektura-pipeline)
- [Boshlash](#-boshlash)
  - [Talablar](#talablar)
  - [O'rnatish](#ornatish)
  - [Muhit o'zgaruvchilari](#muhit-ozgaruvchilari)
  - [Ma'lumotlar bazasi](#malumotlar-bazasi)
  - [Dev serverni ishga tushirish](#dev-serverni-ishga-tushirish)
- [NPM skriptlari](#-npm-skriptlari)
- [Loyiha strukturasi](#-loyiha-strukturasi)
- [Muharrir paneli](#-muharrir-paneli-admin)
- [Roadmap](#-roadmap)
- [Hissa qo'shish](#-hissa-qoshish)
- [Litsenziya](#-litsenziya)

## ✨ Xususiyatlar

- 🔄 **RSS ingestion** — bir nechta manbadan (UzA, Gazeta.uz va h.k.) xabarlarni idempotent yig'ish
- 🧩 **Deduplikatsiya** — Gemini embedding + pgvector cosine o'xshashlik orqali bir xil voqealarni klasterlash
- ✍️ **AI generatsiya** — DeepSeek yordamida klasterlardan o'zbekcha `draft` maqola yaratish, manba attribution va ziddiyat flag bilan
- 👤 **Human-in-the-loop** — har bir AI maqola saytga chiqishidan oldin `/admin` panelida inson tomonidan tasdiqlanadi
- 🔤 **Lotin/Kirill switcher** — server-side transliteratsiya, cookie asosida, `<html lang>` bilan mos
- 🔍 **SEO tayyor** — sitemap, Google News sitemap, chiquvchi RSS va `robots.txt`
- ⚙️ **Pipeline API** — `/api/ingest`, `/api/dedup`, `/api/generate` orqali tashqi trigger (cron/Inngest uchun)

## 🧱 Texnologiyalar

| Qatlam | Texnologiya |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) + TypeScript |
| UI | Tailwind CSS v4 · shadcn/ui · Lucide React |
| Ma'lumotlar bazasi | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/) + pgvector |
| Embedding / dedup | Google Gemini (`gemini-embedding-001`) |
| Matn generatsiyasi | DeepSeek (Vercel AI SDK orqali) |
| Orkestratsiya | [Inngest](https://www.inngest.com/) |
| Distribution | Telegram bot (avtopost) |

## 🏗️ Arxitektura (pipeline)

```
RSS manbalar ─▶ ingest ─▶ raw_items ─▶ dedup (embedding) ─▶ clusters
                                                              │
                                                              ▼
                                              generate (DeepSeek) ─▶ draft maqola
                                                              │
                                                              ▼
                                        /admin ─▶ Tasdiqlash / Tahrirlash / Rad etish
                                                              │
                                                              ▼
                                                     nashr (published) ─▶ sayt + RSS + Telegram
```

## 🚀 Boshlash

### Talablar

- Node.js ≥ 18
- PostgreSQL bazasi (lokal yoki [Neon](https://neon.tech) / [Supabase](https://supabase.com) kabi bepul hosting)

### O'rnatish

```bash
git clone https://github.com/<username>/auranews.git
cd auranews
npm install
```

### Muhit o'zgaruvchilari

`.env.example` dan `.env` yarating va quyidagilarni to'ldiring:

```bash
cp .env.example .env
```

| O'zgaruvchi | Tavsif |
|---|---|
| `DATABASE_URL` | Postgres connection string (pooled) |
| `NEXT_PUBLIC_SITE_URL` | Sayt manzili (SEO/canonical uchun) |
| `INGEST_SECRET` | Pipeline route'larini himoyalovchi maxfiy kalit (ixtiyoriy) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini embedding uchun — [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `DEEPSEEK_API_KEY` | Maqola generatsiyasi uchun — [platform.deepseek.com](https://platform.deepseek.com) |
| `ADMIN_PASSWORD` | `/admin` paneliga kirish paroli |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHANNEL_ID` | Telegram avtopost (ixtiyoriy) |
| `INNGEST_DEV`, `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY` | Pipeline orkestratsiyasi (Inngest) |

### Ma'lumotlar bazasi

Sxemani bazaga yozing va demo ma'lumotni yuklang:

```bash
npm run db:push    # sxemani bazaga qo'llaydi (dev uchun tez yo'l)
npm run db:seed    # 11 ta demo maqola + manbalarni yuklaydi
```

### Dev serverni ishga tushirish

```bash
npm run dev
```

So'ng [http://localhost:3000](http://localhost:3000) manzilini oching.

## 📜 NPM skriptlari

| Buyruq | Vazifa |
|---|---|
| `npm run dev` | Dev serverni ishga tushiradi (Turbopack) |
| `npm run build` / `npm run start` | Production build va start |
| `npm run db:push` | Sxemani migratsiyasiz to'g'ridan-to'g'ri bazaga qo'llaydi (dev) |
| `npm run db:generate` | Sxemadan SQL migratsiya generatsiya qiladi (`lib/db/migrations/`) |
| `npm run db:migrate` | Generatsiya qilingan migratsiyalarni qo'llaydi (prod) |
| `npm run db:seed` | Demo ma'lumotni yuklaydi (idempotent — eskisini tozalaydi) |
| `npm run db:studio` | Drizzle Studio (bazani brauzerda ko'rish) |
| `npm run ingest` | RSS manbalardan xom yangiliklarni yig'adi (`raw_items`) |
| `npm run dedup` | Xom elementlarni embedding qilib klasterlaydi (pgvector) |
| `npm run generate [n]` | Klasterlardan DeepSeek bilan `draft` maqola yaratadi |
| `npm run inngest:dev` | Inngest dev serverini ishga tushiradi (lokal orkestratsiya) |

Pipeline'ni HTTP orqali ham triggerlash mumkin: `POST /api/ingest`, `POST /api/dedup`,
`POST /api/generate` (`INGEST_SECRET` o'rnatilgan bo'lsa `Authorization: Bearer <secret>`).

To'liq pipeline'ni qo'lda ishga tushirish uchun:

```bash
npm run ingest && npm run dedup && npm run generate
```

## 🗂️ Loyiha strukturasi

```
auranews/
├── app/
│   ├── admin/                  # Muharrir paneli (moderatsiya + tahrirlash)
│   ├── api/{ingest,dedup,generate}/  # Pipeline trigger route'lari
│   ├── news/[category]/[slug]/ # Maqola sahifasi
│   ├── sitemap.ts, robots.ts   # SEO
│   └── rss.xml, news-sitemap.xml/    # Chiquvchi RSS + Google News sitemap
├── components/
│   └── article/                # Maqola UI komponentlari (manba attribution va h.k.)
├── lib/
│   ├── db/                     # Drizzle sxemasi, client, query'lar
│   ├── ingest/rss.ts            # RSS yig'ish
│   ├── dedup/                   # Gemini embedding + klasterlash
│   ├── generate/article.ts      # DeepSeek bilan maqola generatsiyasi
│   ├── admin/                   # Admin auth + server actions
│   └── transliterate.ts, script*.ts  # Lotin ⇄ Kirill
├── scripts/                     # ingest / dedup / generate / seed skriptlari
└── .env.example
```

| Yo'l | Tavsif |
|---|---|
| `lib/db/schema.ts` | Drizzle sxemasi: `sources`, `articles`, `article_sources` + enumlar |
| `lib/db/queries.ts` | Chop etilgan maqolalarni o'qish (DB → view-model) |
| `lib/ingest/rss.ts` | RSS yig'ish (fetch + parse + idempotent saqlash) |
| `lib/dedup/embeddings.ts` | Gemini embedding (gemini-embedding-001, 768D) |
| `lib/dedup/cluster.ts` | Cosine o'xshashlik bo'yicha klasterlash (pgvector) |
| `lib/generate/article.ts` | DeepSeek bilan draft maqola generatsiyasi |
| `lib/admin/*` | Admin auth (parol/cookie) + server actions (approve/reject/save) |
| `lib/transliterate.ts` | O'zbek lotin → kirill transliteratsiya dvigateli |
| `app/sitemap.ts`, `app/robots.ts` | Sitemap + robots.txt |

Rukn/hudud filtri URL query orqali server-side ishlaydi: `/?category=Sport&region=Uzbekistan`.

## 🛠️ Muharrir paneli (`/admin`)

`.env` da `ADMIN_PASSWORD` ni belgilang, so'ng [http://localhost:3000/admin](http://localhost:3000/admin)
ga kiring. AI yaratgan maqolalar `draft` bo'lib keladi va saytda ko'rinmaydi;
muharrir **Tasdiqlash** (chop etish), **Tahrirlash** yoki **Rad etish** qiladi.
Siyosat ruknidagi maqolalar "yuqori xavf" deb belgilanadi.

## 🗺️ Roadmap

- [x] DB poydevori (Postgres + Drizzle), status/risk-level, manba attribution
- [x] RSS ingestion (`raw_items`, idempotent, UzA + Gazeta.uz jonli feed)
- [x] Deduplication (Gemini embedding + pgvector, cosine ≥ 0.85, `clusters`)
- [x] AI generatsiya (DeepSeek + Vercel AI SDK, `draft` maqola + attribution + ziddiyat flag)
- [x] `/admin` muharrir paneli (parol-himoya, approve/edit/reject, human-in-the-loop)
- [x] Lotin/Kirill switcher (server-side transliteratsiya, cookie, `<html lang>`)
- [x] Sitemap + Google News sitemap + chiquvchi RSS + robots.txt
- [ ] Inngest pipeline (to'liq orkestratsiya)
- [ ] Telegram avtopost

> **Eslatma:** Lotin/Kirill hozircha cookie asosida ishlaydi (bir xil URL).
> Alohida indekslanadigan `/uz` va `/uz-cyrl` route'lari keyingi SEO
> takomillashtirish bosqichida qo'shiladi.

## 🤝 Hissa qo'shish

Pull request'lar mamnuniyat bilan qabul qilinadi!

1. Repozitoriyni fork qiling
2. Yangi branch yarating (`git checkout -b feature/ajoyib-xususiyat`)
3. O'zgarishlaringizni commit qiling (`git commit -m 'Ajoyib xususiyat qo'shildi'`)
4. Branch'ni push qiling (`git push origin feature/ajoyib-xususiyat`)
5. Pull Request oching

Katta o'zgarishlardan oldin, avval Issue orqali muhokama qilishni tavsiya qilamiz.

## 📄 Litsenziya

Ushbu loyiha [MIT litsenziyasi](./LICENSE) asosida tarqatiladi.
