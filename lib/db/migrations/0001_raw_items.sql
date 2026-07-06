CREATE TYPE "public"."raw_item_status" AS ENUM('new', 'clustered', 'generated', 'skipped');--> statement-breakpoint
CREATE TABLE "raw_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"guid" text NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"content" text,
	"language" text,
	"published_at" timestamp with time zone,
	"status" "raw_item_status" DEFAULT 'new' NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "raw_items" ADD CONSTRAINT "raw_items_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "raw_items_source_guid_key" ON "raw_items" USING btree ("source_id","guid");--> statement-breakpoint
CREATE INDEX "raw_items_status_idx" ON "raw_items" USING btree ("status");