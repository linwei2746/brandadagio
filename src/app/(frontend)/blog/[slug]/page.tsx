import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RichTextRenderer from "@/components/RichTextRenderer";
import Reveal from "@/components/Reveal";
import { getPostBySlug, getPosts } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const otherPosts = (await getPosts(4)).filter(
    (p) => p.slug !== post.slug && p.id !== post.id
  ).slice(0, 3);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 pb-28 md:pt-32">
        <article className="container-luxe max-w-4xl">
          {/* 面包屑导航 */}
          <nav className="flex items-center gap-2 text-xs tracking-wider text-ink/50">
            <Link href="/" className="hover:text-ink">
              HOME
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-ink">
              ブログ（記事）
            </Link>
            <span>/</span>
            <span className="text-ink/80 truncate max-w-[200px] md:max-w-none">
              {post.title}
            </span>
          </nav>

          {/* 文章头部 */}
          <header className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-xs tracking-[0.2em] text-gold uppercase">
              <span>{post.publishedAt.replace(/-/g, ".")}</span>
              <span>・</span>
              <span>記事</span>
            </div>
            <h1 className="font-mincho mt-4 text-2xl font-normal leading-snug tracking-wider text-ink md:text-3xl lg:text-4xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mx-auto mt-6 max-w-2xl text-xs leading-relaxed text-stone md:text-sm">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* 封面大图 */}
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-[2px] bg-line shadow-sm">
            <Image
              src={post.coverImage || "/img/1788083506887.png"}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          {/* 文章正文 */}
          <div className="mt-12 rounded-[2px] bg-ivory p-8 shadow-sm md:p-14">
            <RichTextRenderer
              content={post.content}
              fallbackText={post.excerpt}
            />
          </div>

          {/* 底部作者与资讯保障 */}
          <div className="mt-12 flex flex-col items-center justify-between gap-6 border-y border-line py-8 sm:flex-row">
            <div>
              <span className="label-en text-gold">Editorial</span>
              <p className="font-serif mt-1 text-sm text-ink">brandadagio 鑑定チーム・編集部</p>
              <p className="mt-1 text-xs text-stone">
                エルメス専門店として、正確な鑑定知識と市場データに基づいた情報をお届けします。
              </p>
            </div>
            <Link href="/blog" className="btn-outline shrink-0 text-xs">
              ← 記事一覧に戻る
            </Link>
          </div>

          {/* 推荐其他文章 */}
          {otherPosts.length > 0 && (
            <div className="mt-20">
              <h3 className="font-serif text-center text-lg text-ink">
                こちらの記事もおすすめ
              </h3>
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
                {otherPosts.map((op) => (
                  <Link
                    key={op.id}
                    href={`/blog/${op.slug || op.id}`}
                    className="group block rounded border border-line bg-ivory p-4 shadow-sm transition-all hover:border-gold/50 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] bg-line">
                      <Image
                        src={op.coverImage || "/img/1788083506887.png"}
                        alt={op.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-3 text-[10px] tracking-wider text-gold">
                      {op.publishedAt.replace(/-/g, ".")}
                    </p>
                    <h4 className="mt-1 font-serif text-sm text-ink line-clamp-2 transition-colors group-hover:text-gold">
                      {op.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
