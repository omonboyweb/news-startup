import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest/client";
import { newsPipeline, telegramAutopost } from "@/lib/inngest/functions";

// Generatsiya stepi LLM chaqiradi — /api/generate bilan bir xil limit.
export const maxDuration = 300;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [newsPipeline, telegramAutopost],
});
