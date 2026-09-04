import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { stores } from "@/lib/data";
import Link from "next/link";

export default function StoresPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe">
          <div className="text-center">
            <span className="label-en">Global Boutiques & Salons</span>
            <h1 className="heading-jp mt-4">店舗・サロン一覧</h1>
            <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed tracking-wider text-ink/70 md:text-sm">
              エルメス専門の販売・買取サロン。実物のお品物のご確認・ご購入をはじめ、専門鑑定士による対面での高価買取・委託販売の査定相談を完全予約制のプライベート空間にて承ります。
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[11px] tracking-wider text-stone">
              <span className="rounded-[2px] border border-line bg-ivory px-3 py-1">
                ✓ 店頭販売・実物確認
              </span>
              <span className="rounded-[2px] border border-line bg-ivory px-3 py-1">
                ✓ 専門鑑定士による即日買取・査定
              </span>
              <span className="rounded-[2px] border border-line bg-ivory px-3 py-1">
                ✓ 委託販売・資産相談
              </span>
              <span className="rounded-[2px] border border-line bg-ivory px-3 py-1">
                ✓ 完全個室・プライバシー保護
              </span>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((s, i) => (
              <Reveal key={s.city} delay={(i % 3) * 80}>
                <div className="flex h-full flex-col justify-between rounded-[2px] border border-line bg-ivory p-8 shadow-sm">
                  <div>
                    <span className="label-en text-gold">BOUTIQUE 0{i + 1}</span>
                    <h2 className="font-serif mt-2 text-2xl text-ink">{s.city}</h2>
                    <p className="mt-3 text-xs text-stone leading-relaxed">{s.area}</p>
                    <div className="mt-4 border-t border-line/60 pt-4 text-xs text-ink/70">
                      <span className="block text-[11px] text-ink/50">営業時間</span>
                      <span className="font-medium text-ink">{s.hours}</span>
                    </div>
                    <div className="mt-3 text-[11px] text-stone">
                      対応業務：エルメス商品販売・店頭高価買取・委託査定
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-line pt-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center text-xs tracking-wider text-gold hover:text-gold/80"
                    >
                      来店予約（購入・買取） →
                    </Link>
                    <Link
                      href="/sell"
                      className="text-[11px] tracking-wider text-ink/60 hover:text-ink underline underline-offset-4"
                    >
                      無料オンライン査定
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
