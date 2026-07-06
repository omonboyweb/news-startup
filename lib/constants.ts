export const SITE_NAME = "AuraNews";

export const SITE_DESCRIPTION =
  "Dunyo va O'zbekiston yangiliklari: sun'iy intellekt yordamida tayyorlanadigan, muharrir nazoratidagi zamonaviy axborot portali.";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://auranews.uz"
).replace(/\/$/, "");
