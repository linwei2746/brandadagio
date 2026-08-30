import { stats } from "@/lib/data";
import Reveal from "./Reveal";

export default function Stats() {
  return (
    <section className="border-y border-line bg-ivory py-16">
      <div className="container-luxe grid grid-cols-2 gap-y-10 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="text-center">
            <p className="font-serif text-4xl font-light text-ink md:text-5xl">
              {s.value}
            </p>
            <p className="mt-3 text-[11px] tracking-[0.16em] text-stone">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
