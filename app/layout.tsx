import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { getScript } from "@/lib/script-server";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — AI asosidagi yangiliklar portali`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const script = await getScript();

  return (
    <html
      lang={script === "cyrl" ? "uz-Cyrl" : "uz"}
      className={inter.variable}
    >
      <body className="flex min-h-dvh flex-col font-sans">
        <Header script={script} />
        <main className="flex-1">{children}</main>
        <Footer script={script} />
      </body>
    </html>
  );
}
