import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SellForm from "@/components/SellForm";
import Reveal from "@/components/Reveal";

export default function SellPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe max-w-4xl">
          {/* 页面标题 */}
          <div className="text-center">
            <span className="label-en">Appraisal & Consignment</span>
            <h1 className="heading-jp mt-4">無料オンライン査定・買取</h1>
            <p className="mt-4 text-xs tracking-wider text-ink/60 md:text-sm">
              大切なお品の価値を、世界水準の相場で正当に評価いたします。査定料・送料は一切かかりません。
            </p>
          </div>

          {/* 三步流程 */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded border border-line bg-ivory p-6 text-center shadow-sm">
              <span className="font-serif text-2xl font-light text-gold">01</span>
              <h3 className="font-serif mt-2 text-sm text-ink">写真とお品の情報を送信</h3>
              <p className="mt-2 text-xs text-stone">
                フォームよりお写真と詳細を送信。24時間以内に概算査定額をご案内。
              </p>
            </div>
            <div className="rounded border border-line bg-ivory p-6 text-center shadow-sm">
              <span className="font-serif text-2xl font-light text-gold">02</span>
              <h3 className="font-serif mt-2 text-sm text-ink">送料無料でお品を発送</h3>
              <p className="mt-2 text-xs text-stone">
                宅配キットまたは着払いにて発送。東京銀座サロンでの対面査定も可能。
              </p>
            </div>
            <div className="rounded border border-line bg-ivory p-6 text-center shadow-sm">
              <span className="font-serif text-2xl font-light text-gold">03</span>
              <h3 className="font-serif mt-2 text-sm text-ink">スピード入金</h3>
              <p className="mt-2 text-xs text-stone">
                本査定額にご納得いただけましたら、当日または翌営業日に即時送金。
              </p>
            </div>
          </div>

          {/* 申请表单 */}
          <div className="mt-12">
            <SellForm defaultType="buyback" />
          </div>

          {/* 常见疑问说明 */}
          <div className="mt-20 border-t border-line pt-12">
            <h3 className="heading-jp text-center text-lg">買取・査定についてよくあるご質問</h3>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 text-xs">
              <div className="rounded bg-ivory p-6">
                <p className="font-medium text-gold">Q. 査定後のキャンセルは可能ですか？</p>
                <p className="mt-2 text-stone leading-relaxed">
                  はい、査定額にご納得いただけない場合のキャンセルは自由です。返送時の送料も当社が全額負担いたしますのでご安心ください。
                </p>
              </div>
              <div className="rounded bg-ivory p-6">
                <p className="font-medium text-gold">Q. 買取時に必要なものは何ですか？</p>
                <p className="mt-2 text-stone leading-relaxed">
                  古物営業法に基づき、運転免許証、パスポート、マイナンバーカードなどのご本人様確認書類が必要となります。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
