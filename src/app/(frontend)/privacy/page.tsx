import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe max-w-3xl">
          <h1 className="heading-jp text-center">プライバシーポリシー</h1>
          <div className="mt-12 rounded border border-line bg-ivory p-8 shadow-sm space-y-6 text-xs leading-relaxed text-ink/80 md:p-12 md:text-sm">
            <p>
              {siteConfig.name}（以下「当社」）は、お客様の個人情報の重要性を認識し、その保護を徹底するために以下のプライバシーポリシーを定めます。
            </p>

            <h2 className="font-serif text-base text-ink pt-2">1. 個人情報の収集</h2>
            <p>
              当社は、商品の販売、買取・委託査定のお申し込み、お問い合わせ等の際に、氏名、メールアドレス、電話番号、ご住所等の個人情報を適法かつ公正な手段により取得します。
            </p>

            <h2 className="font-serif text-base text-ink pt-2">2. 利用目的</h2>
            <p>
              取得した個人情報は、商品の発送・決済、査定結果の通知、古物営業法に基づく本人確認、お問い合わせ対応、および新サービスのご案内にのみ利用します。
            </p>

            <h2 className="font-serif text-base text-ink pt-2">3. 第三者提供の制限</h2>
            <p>
              法令に基づく場合を除き、お客様の同意なく第三者に個人情報を提供することはありません。決済および配送業務を委託する場合は、委託先に対して適切な監督を行います。
            </p>

            <h2 className="font-serif text-base text-ink pt-2">4. 安全管理措置</h2>
            <p>
              当社は、個人情報の漏洩、滅失、毀損を防止するため、適切なセキュリティ対策を講じ、安全に保管・管理します。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
