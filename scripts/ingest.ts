import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../lib/db/schema";
import { ingestAllSources } from "../lib/ingest/rss";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL o'rnatilmagan (.env fayliga qarang).");
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema, casing: "snake_case" });

  try {
    console.log("→ Manbalardan yig'ish boshlandi...");
    const summary = await ingestAllSources(db);

    for (const r of summary.sources) {
      const status = r.error ? `XATO: ${r.error}` : `+${r.inserted} yangi`;
      console.log(`  · ${r.source}: ${r.fetched} ta o'qildi, ${status}`);
    }
    console.log(
      `✓ Yakun: ${summary.totalInserted} ta yangi element (${summary.durationMs} ms).`,
    );
  } finally {
    await client.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Ingest xatosi:", error);
    process.exit(1);
  });
