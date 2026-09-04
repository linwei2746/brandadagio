import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Link from "next/link";

const tiers = [
  {
    name: "SILVER",
    title: "シルバーステータス",
    desc: "登録後すぐにご利用いただける基本メンバーシップ。",
    perks: [
      "新入荷情報のメルマガ配信",
      "無料オンライン査定サービス",
      "委託販売手数料優遇",
    ],
  },
  {
    name: "GOLD",
    title: "ゴールドステータス",
    desc: "年間ご利用実績またはご招待によるプレミアム会員。",
    featured: true,
    perks: [
      "希少モデルの先行プレビュー（一般公開24時間前）",
      "専任コンシェルジュによる優先対応",
      "海外拠点（香港・パリ等）からの優先取り寄せ",
      "プライベートサロン完全無料利用",
    ],
  },
  {
    name: "BLACK",
    title: "ブラックステータス",
    desc: "最高峰のコレクター限定、完全招待制のエグゼクティブ。",
    perks: [
      "HSS（特注パーソナルオーダー）等の限定モデル優先案内",
      "世界中からの特別ソーシング（商品リクエスト無料代行）",
      "最高還元率での委託販売保証",
      "専任アドバイザーによる資産運用・コレクションポートフォリオ助言",
    ],
  },
];

export default function MembershipPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe">
          <div className="text-center">
            <span className="label-en">Private Access</span>
            <h1 className="heading-jp mt-4">brandadagio メンバーシップ</h1>
            <p className="mt-4 text-xs tracking-wider text-ink/60 md:text-sm">
              特別なコレクションへの先行アクセスと、専任コンシェルジュによるオーダーメイドのおもてなし。
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {tiers.map((tier) => (
              <Reveal key={tier.name}>
                <div
                  className={`flex h-full flex-col justify-between rounded-[2px] p-8 shadow-sm transition-all ${
                    tier.featured
                      ? "border-2 border-gold bg-ivory shadow-md"
                      : "border border-line bg-ivory"
                  }`}
                >
                  <div>
                    <span className="label-en text-gold">{tier.name}</span>
                    <h2 className="font-serif mt-2 text-xl text-ink">{tier.title}</h2>
                    <p className="mt-3 text-xs text-stone leading-relaxed">{tier.desc}</p>
                    <ul className="mt-6 space-y-3 border-t border-line/60 pt-6 text-xs text-ink/80">
                      {tier.perks.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-gold">✓</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 border-t border-line pt-6">
                    <Link
                      href="/contact"
                      className={`block w-full py-3 text-center text-xs tracking-widest ${
                        tier.featured
                          ? "btn-gold justify-center"
                          : "border border-line bg-cream/50 text-ink hover:border-gold"
                      }`}
                    >
                      入会について問い合わせる
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
