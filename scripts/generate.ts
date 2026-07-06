import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../lib/db/schema";
import { generateDrafts } from "../lib/generate/article";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL o'rnatilmagan (.env fayliga qarang).");
  }

  const limitArg = Number(process.argv[2]);
  const limit = Number.isFinite(limitArg) && limitArg > 0 ? limitArg : 3;

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema, casing: "snake_case" });

  try {
    console.log(`→ ${limit} ta klaster uchun AI generatsiya boshlandi...`);
    const summary = await generateDrafts(db, { limit });

    for (const r of summary.results) {
      if (r.articleId) console.log(`  ✓ draft yaratildi: /news/.../${r.slug}`);
      else if (r.error)
        console.log(`  ✗ klaster ${r.clusterId.slice(0, 8)}: ${r.error}`);
      else
        console.log(
          `  · klaster ${r.clusterId.slice(0, 8)}: o'tkazib yuborildi`,
        );
    }
    console.log(
      `✓ Yakun: ${summary.totalClusters} ta klasterdan ${summary.generated} ta draft maqola yaratildi.`,
    );
  } finally {
    await client.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Generatsiya xatosi:", error);
    process.exit(1);
  });
