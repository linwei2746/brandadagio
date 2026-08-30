import { beyondServices } from "@/lib/data";
import Reveal from "./Reveal";

export default function BeyondServices() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">BEYOND BUYING &amp; SELLING</p>
          <h2 className="heading mt-4">売買を超えたサービス</h2>
          <p className="mt-5 text-sm leading-relaxed text-stone">
            コレクションに関わるすべてのサービスを、ひとつの窓口で。
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {beyondServices.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <div className="flex h-full flex-col gap-4 border-t-2 border-gold/60 bg-ivory p-8">
                <h3 className="font-serif text-xl text-ink">{s.title}</h3>
                <p className="text-sm leading-relaxed text-stone">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
