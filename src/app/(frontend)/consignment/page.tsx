import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SellForm from "@/components/SellForm";
import Reveal from "@/components/Reveal";

export default function ConsignmentPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe max-w-4xl">
          <div className="text-center">
            <span className="label-en">Consignment</span>
            <h1 className="heading-jp mt-4">委託販売サービス</h1>
            <p className="mt-4 text-xs tracking-wider text-ink/60 md:text-sm">
              即時買取を上回る高額売却を実現。世界6拠点の富裕層コレクターネットワークへ直接ご紹介します。
            </p>
          </div>

          {/* 三大优势 */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded border border-line bg-ivory p-6 shadow-sm">
              <span className="font-serif text-lg font-medium text-gold">最大 90% 還元</span>
              <h3 className="font-serif mt-2 text-sm text-ink">手取り額の最大化</h3>
              <p className="mt-2 text-xs leading-relaxed text-stone">
                一般的な買取相場に比べ、売却成約時の手取り額を大幅に高く設定可能です。
              </p>
            </div>
            <div className="rounded border border-line bg-ivory p-6 shadow-sm">
              <span className="font-serif text-lg font-medium text-gold">GLOBAL NETWORK</span>
              <h3 className="font-serif mt-2 text-sm text-ink">世界のVIP顧客へ直結</h3>
              <p className="mt-2 text-xs leading-relaxed text-stone">
                東京・香港・シンガポール・ドバイなど、希少モデルを求める国際バイヤーへ即時提案。
              </p>
            </div>
            <div className="rounded border border-line bg-ivory p-6 shadow-sm">
              <span className="font-serif text-lg font-medium text-gold">SAFE & SECURE</span>
              <h3 className="font-serif mt-2 text-sm text-ink">厳重保管とプロ撮影</h3>
              <p className="mt-2 text-xs leading-relaxed text-stone">
                温湿度管理された専用金庫で厳重保管。スタジオライティングによる高品質撮影で魅力を最大限に引き出します。
              </p>
            </div>
          </div>

          {/* 表单 */}
          <div className="mt-14">
            <div className="mb-6 text-center">
              <h2 className="heading-jp text-xl">委託販売のお申し込み</h2>
              <p className="mt-2 text-xs text-ink/60">
                お品物の情報とお写真をお送りください。販売想定価格と受取想定額をご提示いたします。
              </p>
            </div>
            <SellForm defaultType="consignment" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
