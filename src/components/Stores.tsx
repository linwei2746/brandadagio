import { stores } from "@/lib/data";
import Reveal from "./Reveal";

export default function Stores() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="label-en">Boutiques</span>
          <h2 className="heading-jp mt-5">店舗へお越しください</h2>
          <p className="mt-5 text-sm leading-relaxed text-stone">
            東京・大阪・香港・シンガポール・ドバイ・パリに拠点があります。
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((s, i) => (
            <Reveal key={s.city} delay={(i % 3) * 90}>
              <div className="group flex h-full flex-col gap-3 bg-ivory p-8 transition-colors hover:bg-cream md:p-9">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-xl text-ink">{s.city}</h3>
                  <span className="text-[11px] tracking-[0.12em] text-gold">{s.hours}</span>
                </div>
                <p className="text-sm text-stone">{s.area}</p>
                <span className="mt-3 text-[12px] tracking-[0.14em] text-ink transition-colors group-hover:text-gold">
                  店舗詳細 →
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
