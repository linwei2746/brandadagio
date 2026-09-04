import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-32 pb-32">
        <div className="container-luxe max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
              <path d="M8 8V6a4 4 0 0 1 8 0v2" strokeLinecap="round" />
              <rect x="4" y="8" width="16" height="13" rx="2" />
            </svg>
          </div>

          <span className="label-en mt-6 block text-gold">SHOPPING BAG</span>
          <h1 className="heading-jp mt-3">ショッピングバッグ</h1>

          <p className="mt-4 text-xs leading-relaxed text-ink/70 md:text-sm">
            当店の取り扱い品はすべて世界に一点限りの希少なヴィンテージおよび現行コレクションです。
            <br />
            各商品の詳細ページより「購入手続きへ」ボタンにて直接安全にご決済いただけます。
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link href="/shop" className="btn-gold">
              コレクション一覧を見る
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
