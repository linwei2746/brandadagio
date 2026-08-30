import Link from "next/link";
import Reveal from "./Reveal";

const points = [
  {
    title: "グローバルソーシング",
    body: "東京・香港・シンガポール・ドバイ・パリなど、世界主要都市の在庫へアクセス。",
  },
  {
    title: "鑑定・正規品保証",
    body: "お探しするすべてのお品は、厳格な鑑定基準に基づき真贋を確認します。",
  },
  {
    title: "ご成約まで費用不要",
    body: "ソーシングは無料。理想のお品が見つかりご成約の場合のみ費用が発生します。",
  },
];

export default function RequestService() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-ivory/90" />

      <div className="container-luxe relative py-24 text-ink md:py-32">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-gold">SOURCING SERVICE</p>
          <h2 className="mt-4 font-serif text-3xl font-light leading-tight md:text-[2.6rem]">
            商品リクエストサービス
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-ink/80">
            お探しのお品が見つからない場合は、専門チームが世界各地のネットワークを活用し、
            ご希望のバッグをお探しいたします。
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="border-t border-gold/40 pt-5">
                <h3 className="font-serif text-lg text-gold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <Link href="/request" className="btn-gold">
            リクエストを送信
          </Link>
        </div>
      </div>
    </section>
  );
}
