// O'zbekcha (lotin) sarlavhadan URL-xavfsiz slug yasaydi.
// o'zbekiston -> ozbekiston, tutuq belgilari olib tashlanadi.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/['ʻʼ`‘’]/g, "") // tutuq belgilari (o', g', ...)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // diakritik belgilar
    .replace(/[^a-z0-9]+/g, "-") // qolgan hamma narsa -> defis
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}
