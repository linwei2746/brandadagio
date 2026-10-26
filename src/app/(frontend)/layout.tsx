import type { Metadata } from "next";
import { EB_Garamond, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// 可変フォントのため、weight をいくつ並べても配信されるファイル数は同じ
// （EB Garamond は normal 7 + italic 7 = 14 ファイル固定）。
// 実際に描画で使われている字重だけを宣言する。600 は未使用。
// なお EB Garamond に 300 は存在しない（提供は 400〜800）。
// body の font-weight: 300 を継承した箇所は 400 で描画される。
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-eb",
  display: "swap",
});

// 600 は商品詳細ページの価格（font-semibold）で使用。未宣言だと 500 に丸められていた。
const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["300", "400"],
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
