CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
CREATE TYPE "public"."cluster_status" AS ENUM('open', 'generated');--> statement-breakpoint
CREATE TABLE "clusters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"representative_title" text,
	"item_count" integer DEFAULT 0 NOT NULL,
	"status" "cluster_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "raw_items" ADD COLUMN "cluster_id" uuid;--> statement-breakpoint
ALTER TABLE "raw_items" ADD COLUMN "embedding" vector(768);--> statement-breakpoint
ALTER TABLE "raw_items" ADD CONSTRAINT "raw_items_cluster_id_clusters_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."clusters"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "raw_items_cluster_id_idx" ON "raw_items" USING btree ("cluster_id");--> statement-breakpoint
CREATE INDEX "raw_items_embedding_idx" ON "raw_items" USING hnsw ("embedding" vector_cosine_ops);