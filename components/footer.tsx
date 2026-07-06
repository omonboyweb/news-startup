import Link from "next/link";

import { tr, type Script } from "@/lib/script";
import { CATEGORIES } from "@/lib/types";

const FOOTER_LINKS: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Bo'limlar",
    links: CATEGORIES.map((category) => ({
      label: category,
      href: `/?category=${encodeURIComponent(category)}`,
    })),
  },
  {
    title: "Kompaniya",
    links: [
      { label: "Biz haqimizda", href: "#" },
      { label: "Tahririyat", href: "#" },
      { label: "Aloqa", href: "#" },
    ],
  },
  {
    title: "Huquqiy",
    links: [
      { label: "Maxfiylik siyosati", href: "#" },
      { label: "Foydalanish shartlari", href: "#" },
      { label: "Mas'uliyatni cheklash", href: "#" },
    ],
  },
];

export function Footer({ script }: { script: Script }) {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
                A
              </span>
              <span className="text-lg font-semibold tracking-tight">
                AuraNews
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {tr(
                "Sun'iy intellekt yordamida tayyorlanadigan, muharrir nazoratidagi zamonaviy yangiliklar platformasi.",
                script,
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="text-sm font-semibold">
                  {tr(group.title, script)}
                </h3>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {tr(link.label, script)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; 2026 AuraNews.{" "}
            {tr("Barcha huquqlar himoyalangan.", script)}
          </p>
          <p>
            {tr(
              "Materiallar AI yordamida tayyorlanadi va muharrir tasdiqlaydi.",
              script,
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
