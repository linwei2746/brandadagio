import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getPosts } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPosts(50);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe">
          {/* 页面标题 */}
          <div className="text-center">
            <span className="label-en">Blog & Articles</span>
            <h1 className="heading-jp mt-4">ブログ一覧</h1>
            <p className="mt-4 text-xs tracking-wider text-ink/60 md:text-sm">
              専門鑑定士によるエルメスの真贋・相場動向・コレクション管理の最新コラムをお届けします。
            </p>
          </div>

          {/* 文章网格 */}
          {posts.length > 0 ? (
            <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 80}>
                  <Link
                    href={`/blog/${post.slug || post.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[2px] border border-line bg-ivory shadow-sm transition-all hover:border-gold/50 hover:shadow-md"
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
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="flex items-center justify-between text-[11px] tracking-wider text-gold">
                          <span>{post.publishedAt.replace(/-/g, ".")}</span>
                          <span className="rounded bg-gold/10 px-2 py-0.5 text-[10px]">記事</span>
                        </div>
                        <h2 className="mt-3 font-serif text-lg font-normal leading-snug text-ink transition-colors group-hover:text-gold">
                          {post.title}
                        </h2>
                        <p className="mt-3 text-xs leading-relaxed text-stone line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 text-xs font-medium tracking-wider text-gold">
                        <span>記事を読む</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-base text-ink/60">現在公開中の記事はありません。</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
