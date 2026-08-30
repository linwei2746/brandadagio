import { reasons } from "@/lib/data";
import Reveal from "./Reveal";

export default function WhyUs() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">WHY BRANDADAGIO</p>
          <h2 className="heading mt-4">選ばれる理由</h2>
          <p className="mt-5 text-sm leading-relaxed text-stone">
            15年以上にわたり築き上げた専門性と、世界規模のネットワーク。
            信頼のラグジュアリー流通サービスをご提供します。
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 90}>
              <div className="flex h-full flex-col gap-4 bg-ivory p-8 md:p-9">
                <span className="font-serif text-3xl font-light text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-lg text-ink">{r.title}</h3>
                <p className="text-sm leading-relaxed text-stone">{r.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
