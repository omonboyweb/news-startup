import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL o'rnatilmagan. .env fayliga Postgres connection string qo'shing (.env.example ga qarang).",
  );
}

// Dev'da HMR har qayta yuklanishda yangi ulanish ochib poolni tugatib
// qo'ymasligi uchun clientni global obyektda keshlaymiz.
const globalForDb = globalThis as unknown as {
  __pgClient?: ReturnType<typeof postgres>;
};

// prepare:false â transaction-pooling (Supabase pgBouncer / Neon pooled)
// bilan mos ishlashi uchun.
const client =
  globalForDb.__pgClient ?? postgres(connectionString, { prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pgClient = client;
}

export const db = drizzle(client, { schema, casing: "snake_case" });
