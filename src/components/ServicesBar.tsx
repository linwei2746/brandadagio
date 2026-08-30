import Link from "next/link";
import Reveal from "./Reveal";

const services = [
  {
    en: "Buy",
    title: "買取",
    body: "24時間以内にオンライン査定。条件を満たすお品には、即日での現金化も承ります。",
    href: "/sell",
  },
  {
    en: "Sell",
    title: "販売",
    body: "専門鑑定士が真贋を確認した上質なエルメスを、安心してお求めいただけます。",
    href: "/shop",
  },
  {
    en: "Consignment",
    title: "委託販売",
    body: "世界6拠点のコレクターネットワークを通じ、一点ものにふさわしい価格を目指します。",
    href: "/consignment",
  },
];

export default function ServicesBar() {
  return (
    <section className="bg-ivory py-24 md:py-32">
      <Reveal className="container-luxe text-center">
        <span className="label-en">Service</span>
        <h2 className="heading-jp mt-5">エルメスの、売る・買うを上質に</h2>
      </Reveal>

      <div className="container-luxe mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 90}>
            <Link
              href={s.href}
              className="group flex h-full flex-col items-center gap-4 rounded-[3px] border border-line bg-ivory px-8 py-14 text-center transition-all duration-300 hover:border-gold/50 hover:bg-cream/50"
            >
              <span className="font-serif text-lg italic tracking-wide text-gold">
                {s.en}
              </span>
              <span className="h-8 w-px bg-gold/40" />
              <h3 className="font-serif text-2xl font-light tracking-[0.08em] text-ink">
                {s.title}
              </h3>
              <p className="mt-1 max-w-xs text-[13px] leading-[2] text-ink/65">
                {s.body}
              </p>
              <span className="mt-3 text-[11px] tracking-[0.2em] text-ink/50 transition-colors group-hover:text-gold">
                VIEW MORE →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
