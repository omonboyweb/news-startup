CREATE TYPE "public"."article_status" AS ENUM('draft', 'published', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."category" AS ENUM('Siyosat', 'Iqtisodiyot', 'Sport', 'Texnologiya', 'Ilm-fan');--> statement-breakpoint
CREATE TYPE "public"."region" AS ENUM('Uzbekistan', 'Jahon');--> statement-breakpoint
CREATE TYPE "public"."risk_level" AS ENUM('low', 'high');--> statement-breakpoint
CREATE TYPE "public"."source_reuse_policy" AS ENUM('full_rewrite', 'report_only');--> statement-breakpoint
CREATE TABLE "article_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"source_id" uuid,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"tldr" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"category" "category" NOT NULL,
	"region" "region" NOT NULL,
	"status" "article_status" DEFAULT 'draft' NOT NULL,
	"risk_level" "risk_level" DEFAULT 'low' NOT NULL,
	"editorial_notes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"image_url" text,
	"read_time_minutes" integer DEFAULT 3 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"homepage_url" text,
	"feed_url" text,
	"reuse_policy" "source_reuse_policy" DEFAULT 'report_only' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_sources" ADD CONSTRAINT "article_sources_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_sources" ADD CONSTRAINT "article_sources_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_sources_article_id_idx" ON "article_sources" USING btree ("article_id");--> statement-breakpoint
CREATE UNIQUE INDEX "articles_slug_key" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "articles_status_published_at_idx" ON "articles" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "sources_name_key" ON "sources" USING btree ("name");