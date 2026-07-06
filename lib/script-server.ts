import "server-only";

import { cookies } from "next/headers";

import { DEFAULT_SCRIPT, SCRIPT_COOKIE, type Script } from "@/lib/script";

/** Joriy alifboni cookie'dan o'qiydi (server komponentlar uchun). */
export async function getScript(): Promise<Script> {
  const value = (await cookies()).get(SCRIPT_COOKIE)?.value;
  return value === "cyrl" ? "cyrl" : DEFAULT_SCRIPT;
}
