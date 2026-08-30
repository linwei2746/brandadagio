import Image from "next/image";
import Link from "next/link";
import { journal } from "@/lib/data";
import Reveal from "./Reveal";

export default function Journal() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-luxe">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="label-en">Journal</span>
            <h2 className="heading-jp mt-5">ジャーナル</h2>
          </div>
          <Link href="/journal" className="btn-view">
            View More
          </Link>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          {journal.map((post, i) => (
            <Reveal key={post.title} delay={i * 90}>
              <Link href="/journal" className="group block">
                <div className="relative aspect-[3/2] overflow-hidden bg-line">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 text-[11px] tracking-[0.14em] text-gold">
                  {post.date.replace(/-/g, ".")}
                </p>
                <h3 className="mt-2 font-serif text-lg leading-snug text-ink transition-colors group-hover:text-gold">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone line-clamp-3">
                  {post.excerpt}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
