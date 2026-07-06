import { google } from "@ai-sdk/google";
import { embedMany } from "ai";

// Gemini embedding modeli (TZ: DeepSeek embedding bermagani uchun Gemini).
// gemini-embedding-001 3072 gacha o'lchov beradi; 768 tez va pgvector uchun
// yetarli. Cosine masofa ishlatgani uchun normalizatsiya shart emas.
export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 768;

const model = google.textEmbeddingModel(EMBEDDING_MODEL);

const providerOptions = {
  google: {
    outputDimensionality: EMBEDDING_DIMENSIONS,
    // Dedup/klasterlash uchun eng mos task turi.
    taskType: "SEMANTIC_SIMILARITY",
  },
};

/** Xom elementdan embedding uchun matn tayyorlaydi (sarlavha + qisqa mazmun). */
export function embeddingInput(item: {
  title: string;
  summary?: string | null;
}): string {
  return [item.title, item.summary ?? ""]
    .filter(Boolean)
    .join("\n")
    .slice(0, 8000);
}

/** Matnlar to'plamini bitta so'rovda vektorlarga aylantiradi. */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }
  const { embeddings } = await embedMany({ model, values: texts, providerOptions });
  return embeddings;
}
