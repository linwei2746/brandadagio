import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AppraisalPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe max-w-3xl text-center">
          <span className="label-en">Authentication & Appraisal</span>
          <h1 className="heading-jp mt-4">鑑定・査定サービス</h1>
          <p className="mt-4 text-xs tracking-wider text-ink/60 md:text-sm">
            20年以上の鑑定歴を持つ専門鑑定士が、刻印・ステッチ・金具・レザーを多角的に検証し、確かな真贋と適正価値を判定いたします。
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 text-left">
            <div className="rounded border border-line bg-ivory p-8 shadow-sm">
              <h2 className="font-serif text-lg text-ink">オンライン事前査定</h2>
              <p className="mt-3 text-xs leading-relaxed text-stone">
                写真をお送りいただくだけで、24時間以内に概算の買取・委託販売想定額をお知らせします。手数料は完全無料です。
              </p>
              <Link href="/sell" className="btn-gold mt-6 inline-flex text-xs">
                無料査定を申し込む →
              </Link>
            </div>

            <div className="rounded border border-line bg-ivory p-8 shadow-sm">
              <h2 className="font-serif text-lg text-ink">サロン対面鑑定（銀座）</h2>
              <p className="mt-3 text-xs leading-relaxed text-stone">
                東京・銀座のプライベートサロンにて、お品物を直接拝見しながら鑑定士が詳細にご説明いたします（完全予約制）。
              </p>
              <Link href="/contact" className="btn-outline mt-6 inline-flex text-xs">
                サロン予約をする →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
