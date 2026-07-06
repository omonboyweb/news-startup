import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../lib/db/schema";
import { clusterNewItems } from "../lib/dedup/cluster";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL o'rnatilmagan (.env fayliga qarang).");
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema, casing: "snake_case" });

  try {
    console.log("→ Deduplication (embedding + klasterlash) boshlandi...");
    const summary = await clusterNewItems(db);
    console.log(
      `✓ Yakun: ${summary.processed} ta element â ${summary.newClusters} ta yangi klaster, ${summary.joined} tasi mavjud klasterga qo'shildi (chegara: ${summary.threshold}).`,
    );
  } finally {
    await client.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Dedup xatosi:", error);
    process.exit(1);
  });
