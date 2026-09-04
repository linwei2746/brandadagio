import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getPosts } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const posts = await getPosts(30);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe">
          <div className="text-center">
            <span className="label-en">Knowledge & Stories</span>
            <h1 className="heading-jp mt-4">ジャーナル</h1>
            <p className="mt-4 text-xs tracking-wider text-ink/60 md:text-sm">
              専門鑑定士によるエルメスの真贋、資産価値、コレクションの美学について。
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 80}>
                <Link
                  href={`/journal/${post.slug}`}
                  className="group flex flex-col overflow-hidden bg-ivory shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-line">
                    <Image
                      src={post.coverImage || "/img/1788083506887.png"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[11px] tracking-[0.14em] text-gold">
                      {post.publishedAt.replace(/-/g, ".")}
                    </span>
                    <h2 className="mt-2 font-serif text-lg leading-snug text-ink transition-colors group-hover:text-gold">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-xs leading-relaxed text-stone line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between text-[11px] tracking-wider text-gold">
                      <span>READ MORE</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
