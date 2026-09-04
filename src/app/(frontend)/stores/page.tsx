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
            <span className="label-en">Global Boutiques</span>
            <h1 className="heading-jp mt-4">店舗・サロン一覧</h1>
            <p className="mt-4 text-xs tracking-wider text-ink/60 md:text-sm">
              完全予約制のプライベートサロンにて、極上のお品と特別な時間をお届けいたします。
            </p>
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
                  </div>

                  <div className="mt-8 border-t border-line pt-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center text-xs tracking-wider text-gold hover:text-gold/80"
                    >
                      ご来店予約・お問い合わせ →
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
