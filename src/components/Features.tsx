import Image from "next/image";
import Reveal from "./Reveal";

const points = [
  {
    no: "01",
    title: "確かな真贋鑑定",
    body: "数十年の実務経験を持つ専門鑑定士が、フォルム・金具・刻印・レザーの一点一点を厳格に確認。すべてのお品に鑑定証明をお付けし、安心してお取引いただけます。",
    image: "/img/1788083536114.png",
  },
  {
    no: "02",
    title: "納得の高価買取",
    body: "国内外の相場をリアルタイムに反映し、お品の状態と希少性を正当に評価。委託販売との比較もご提案し、あなたにとって最良の売却方法をお選びいただけます。",
    image: "/img/1788083522155.png",
  },
  {
    no: "03",
    title: "世界6拠点のネットワーク",
    body: "東京・大阪・香港・シンガポール・ドバイ・パリ。世界中のコレクターへお品をご紹介し、一点ものにふさわしい価値と、次の持ち主との出会いをお届けします。",
    image: "/img/1788083542753.png",
  },
];

export default function Features() {
  return (
    <section className="bg-ivory py-24 md:py-32">
      <Reveal className="container-luxe text-center">
        <span className="label-en">Features</span>
        <h2 className="heading-jp mt-5">選ばれる理由</h2>
      </Reveal>

      <div className="container-luxe mt-16 space-y-20 md:mt-24 md:space-y-28">
        {points.map((p, i) => (
          <Reveal key={p.no}>
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
              {/* 画像 */}
              <div
                className={`relative aspect-[5/4] overflow-hidden rounded-[2px] bg-cream shadow-[0_30px_60px_-40px_rgba(60,52,44,0.4)] ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* テキスト */}
              <div className={i % 2 === 1 ? "md:order-1 md:pr-8" : "md:pl-8"}>
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-[11px] tracking-[0.3em] text-gold">
                    POINT
                  </span>
                  <span className="font-serif text-5xl font-light text-gold/70">
                    {p.no}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-light tracking-[0.04em] text-ink md:text-[1.75rem]">
                  {p.title}
                </h3>
                <p className="mt-5 max-w-md text-[13px] leading-[2.2] tracking-[0.02em] text-ink/70 md:text-sm">
                  {p.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
