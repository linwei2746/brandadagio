import Link from "next/link";
import Reveal from "./Reveal";

const steps = [
  { n: "01", t: "オンライン査定", d: "写真とお品の情報を送信するだけ。24時間以内に初回査定。" },
  { n: "02", t: "鑑定士による評価", d: "送料当社負担でお送りいただき、専門鑑定士が最終評価。" },
  { n: "03", t: "スピード入金", d: "買取は即時お支払い。委託はご成約後すみやかに送金。" },
];

export default function SellCTA() {
  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="container-luxe">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">SELL WITH US</p>
            <h2 className="heading mt-4">大切なお品を、最良の価値で。</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-stone">
              査定・買取から委託販売まで。世界6拠点のバイヤーネットワークが、
              あなたのコレクションに最良の売却先をお届けします。
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/sell" className="btn-gold justify-center">
                無料査定を申し込む
              </Link>
              <Link href="/consignment" className="btn-outline justify-center">
                委託販売を始める
              </Link>
            </div>
          </Reveal>

          <div className="space-y-px bg-line">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="flex items-start gap-6 bg-ivory p-7">
                  <span className="font-serif text-3xl font-light text-gold">{s.n}</span>
                  <div>
                    <h3 className="font-serif text-lg text-ink">{s.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
