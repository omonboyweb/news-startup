// O'zbek lotin -> kirill transliteratsiyasi (server-side, deterministik).
// TZ 3: auditoriyaning katta qismi kirillda o'qiydi.

// Digraflar (uzunroq ketma-ketliklar avval). Tutuq/apostrof variantlari:
// ', ʻ, ʼ, ‘, ’.
const DIGRAPHS: [RegExp, string][] = [
  [/O['ʻʼ‘’]/g, "Ў"],
  [/o['ʻʼ‘’]/g, "ў"],
  [/G['ʻʼ‘’]/g, "Ғ"],
  [/g['ʻʼ‘’]/g, "ғ"],
  [/Sh/g, "Ш"],
  [/SH/g, "Ш"],
  [/sh/g, "ш"],
  [/Ch/g, "Ч"],
  [/CH/g, "Ч"],
  [/ch/g, "ч"],
  [/Yo/g, "Ё"],
  [/YO/g, "Ё"],
  [/yo/g, "ё"],
  [/Yu/g, "Ю"],
  [/YU/g, "Ю"],
  [/yu/g, "ю"],
  [/Ya/g, "Я"],
  [/YA/g, "Я"],
  [/ya/g, "я"],
  [/Ye/g, "Е"],
  [/YE/g, "Е"],
  [/ye/g, "е"],
];

const SINGLE_BASE: Record<string, string> = {
  a: "а",
  b: "б",
  c: "с",
  d: "д",
  e: "е",
  f: "ф",
  g: "г",
  h: "ҳ",
  i: "и",
  j: "ж",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  q: "қ",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  v: "в",
  x: "х",
  y: "й",
  z: "з",
};

const SINGLE: Record<string, string> = {};
for (const [latin, cyr] of Object.entries(SINGLE_BASE)) {
  SINGLE[latin] = cyr;
  SINGLE[latin.toUpperCase()] = cyr.toUpperCase();
}

// So'z boshidagi harf sanalmaydigan belgilar (apostrof so'z ichida deb qaraladi).
const WORD_BOUNDARY = "[^A-Za-z'ʻʼ‘’]";

export function toCyrillic(input: string): string {
  let s = input;

  // 1) So'z boshidagi e/E -> э/Э (so'z ichida esa е). "ye" digrafi keyin.
  s = s.replace(new RegExp(`(^|${WORD_BOUNDARY})e`, "g"), "$1э");
  s = s.replace(new RegExp(`(^|${WORD_BOUNDARY})E`, "g"), "$1Э");

  // 2) Digraflar.
  for (const [pattern, replacement] of DIGRAPHS) {
    s = s.replace(pattern, replacement);
  }

  // 3) Qolgan tutuq belgilari -> ъ (o'/g' allaqachon iste'mol qilingan).
  s = s.replace(/['ʻʼ‘’]/g, "ъ");

  // 4) Yakka harflar.
  s = s.replace(/[A-Za-z]/g, (ch) => SINGLE[ch] ?? ch);

  return s;
}
