import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";

export default function LawPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe max-w-3xl">
          <h1 className="heading-jp text-center">特定商取引法に基づく表記</h1>
          <div className="mt-12 rounded border border-line bg-ivory p-8 shadow-sm md:p-12">
            <dl className="divide-y divide-line text-xs leading-relaxed md:text-sm">
              <div className="py-4 sm:grid sm:grid-cols-3">
                <dt className="font-medium text-ink/60">事業者名</dt>
                <dd className="sm:col-span-2 text-ink">{siteConfig.name}</dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3">
                <dt className="font-medium text-ink/60">所在地</dt>
                <dd className="sm:col-span-2 text-ink">東京都中央区銀座</dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3">
                <dt className="font-medium text-ink/60">連絡先</dt>
                <dd className="sm:col-span-2 text-ink">
                  電話番号: {siteConfig.contact.tel}
                  <br />
                  メール: {siteConfig.contact.email}
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3">
                <dt className="font-medium text-ink/60">販売価格</dt>
                <dd className="sm:col-span-2 text-ink">
                  各商品ページに表示された金額（税込）
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3">
                <dt className="font-medium text-ink/60">商品代金以外の必要料金</dt>
                <dd className="sm:col-span-2 text-ink">
                  国内配送料無料。銀行振込手数料はお客様負担となります。
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3">
                <dt className="font-medium text-ink/60">お支払い方法</dt>
                <dd className="sm:col-span-2 text-ink">
                  クレジットカード決済（Stripe）、銀行振込
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3">
                <dt className="font-medium text-ink/60">商品の引渡時期</dt>
                <dd className="sm:col-span-2 text-ink">
                  決済完了後、原則として1〜3営業日以内に発送いたします。
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3">
                <dt className="font-medium text-ink/60">返品・交換について</dt>
                <dd className="sm:col-span-2 text-ink">
                  真贋保証対象品につき、万が一正規品でない場合は全額返金対応いたします。商品の性質上（一点物）、お客様都合による交換はお受けできません。
                </dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3">
                <dt className="font-medium text-ink/60">古物商許可番号</dt>
                <dd className="sm:col-span-2 text-ink">
                  東京都公安委員会 第301000000000号
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
