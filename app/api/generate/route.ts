import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateDrafts } from "@/lib/generate/article";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  const secret = process.env.INGEST_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  let limit = 5;
  try {
    const body = await request.json();
    if (typeof body?.limit === "number" && body.limit > 0) {
      limit = Math.min(body.limit, 20);
    }
  } catch {
    // tanasiz so'rov â default limit
  }

  try {
    const summary = await generateDrafts(db, { limit });
    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
