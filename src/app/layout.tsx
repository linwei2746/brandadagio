import type { Metadata } from "next";
import { EB_Garamond, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-eb",
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name}｜ラグジュアリーバッグの販売・買取・委託販売`,
    template: `%s｜${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name}｜ラグジュアリーバッグの販売・買取・委託販売`,
    description: siteConfig.description,
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${ebGaramond.variable} ${notoSansJp.variable} ${notoSerifJp.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
