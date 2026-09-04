import Image from "next/image";
import Link from "next/link";
import { getPosts, type PostItem } from "@/lib/cms";
import Reveal from "./Reveal";

export default async function Journal({ posts }: { posts?: PostItem[] }) {
  const items = posts || (await getPosts(3));

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-luxe">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="label-en">Blog & Journal</span>
            <h2 className="heading-jp mt-5">ブログ</h2>
          </div>
          <Link href="/blog" className="btn-view">
            View More
          </Link>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          {items.map((post, i) => (
            <Reveal key={post.id || post.title} delay={i * 90}>
              <Link href={`/blog/${post.slug || post.id}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden bg-line">
                  <Image
                    src={post.coverImage || "/img/1788083506887.png"}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 text-[11px] tracking-[0.14em] text-gold">
                  {post.publishedAt.replace(/-/g, ".")}
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
