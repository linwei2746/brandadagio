import Link from "next/link";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "ショップ",
    links: [
      { label: "全コレクション", href: "/shop" },
      { label: "バッグ", href: "/shop?category=bag" },
      { label: "ジュエリー", href: "/shop?category=jewelry" },
      { label: "商品リクエスト", href: "/request" },
    ],
  },
  {
    title: "サービス",
    links: [
      { label: "買取", href: "/sell" },
      { label: "委託販売", href: "/consignment" },
      { label: "ブログ", href: "/blog" },
      { label: "鑑定・査定", href: "/appraisal" },
      { label: "メンバーシップ", href: "/membership" },
    ],
  },
  {
    title: "会社情報",
    links: [
      { label: "私たちについて", href: "/about" },
      { label: "店舗一覧", href: "/stores" },
      { label: "お問い合わせ", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ivory text-ink">
      {/* アプリ訴求 */}
      <div className="border-b border-ink/10">
        <div className="container-luxe flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <div>
            <span className="label-en">Luxury Asset Platform</span>
            <h3 className="mt-3 font-serif text-2xl font-light">
              コレクションを、いつでも手のひらに。
            </h3>
          </div>
          <div className="flex gap-3">
            <span className="flex h-12 items-center border border-ink/25 px-5 text-xs tracking-[0.14em] text-ink/80">
              App Store
            </span>
            <span className="flex h-12 items-center border border-ink/25 px-5 text-xs tracking-[0.14em] text-ink/80">
              Google Play
            </span>
          </div>
        </div>
      </div>

      {/* リンク群 */}
      <div className="container-luxe grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <span className="font-serif text-xl tracking-[0.28em] uppercase">{siteConfig.name}</span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/60">
            {siteConfig.description}
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-[11px] font-medium uppercase tracking-luxe text-gold">
              {col.title}
            </p>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink/70 transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* コピーライト */}
      <div className="border-t border-ink/10">
        <div className="container-luxe flex flex-col items-center justify-between gap-3 py-6 text-[11px] tracking-[0.1em] text-ink/50 md:flex-row">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ink/80">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="hover:text-ink/80">
              利用規約
            </Link>
            <Link href="/law" className="hover:text-ink/80">
              特定商取引法
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
