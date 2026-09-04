import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe max-w-3xl">
          <h1 className="heading-jp text-center">利用規約</h1>
          <div className="mt-12 rounded border border-line bg-ivory p-8 shadow-sm space-y-6 text-xs leading-relaxed text-ink/80 md:p-12 md:text-sm">
            <p>
              この利用規約（以下「本規約」）は、{siteConfig.name}（以下「当社」）が運営する本ウェブサイトの利用条件を定めるものです。
            </p>

            <h2 className="font-serif text-base text-ink pt-2">第1条（適用）</h2>
            <p>
              本規約は、本サービスの利用に関わる一切の関係に適用されます。利用者は、本規約に同意の上で本サービスを利用するものとします。
            </p>

            <h2 className="font-serif text-base text-ink pt-2">第2条（売買契約の成立）</h2>
            <p>
              商品の売買契約は、利用者が購入手続きを完了し、当社が注文完了メールを発信した時点で成立するものとします。取り扱い商品は原則として一点物のため、店頭等での先約やシステム反映の時差によりご注文を承れない場合がございます。
            </p>

            <h2 className="font-serif text-base text-ink pt-2">第3条（真贋保証と返品）</h2>
            <p>
              販売する商品は、すべて専門鑑定士により真贋確認を行った正規品です。万が一正規品でないと証明された場合には、全額返金保証いたします。お客様都合による返品は、商品到着後3日以内・未使用状態に限り承ります。
            </p>

            <h2 className="font-serif text-base text-ink pt-2">第4条（買取および委託）</h2>
            <p>
              買取および委託販売の申し込みにおいて、利用者は真正な品物および正確な個人情報を提供する義務を負います。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
