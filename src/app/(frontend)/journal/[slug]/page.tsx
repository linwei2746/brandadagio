import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RichTextRenderer from "@/components/RichTextRenderer";
import Reveal from "@/components/Reveal";
import { getPostBySlug, getPosts } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function JournalDetailPage({
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
          {/* 面包屑 */}
          <nav className="flex items-center gap-2 text-xs tracking-wider text-ink/50">
            <Link href="/" className="hover:text-ink">
              HOME
            </Link>
            <span>/</span>
            <Link href="/journal" className="hover:text-ink">
              JOURNAL
            </Link>
            <span>/</span>
            <span className="text-ink/80 truncate max-w-[200px] md:max-w-none">
              {post.title}
            </span>
          </nav>

          {/* 文章头部 */}
          <header className="mt-8 text-center">
            <span className="text-xs tracking-[0.2em] text-gold uppercase">
              {post.publishedAt.replace(/-/g, ".")}
            </span>
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

          {/* 返回列表按钮 */}
          <div className="mt-12 text-center">
            <Link href="/journal" className="btn-outline inline-flex">
              ← ジャーナル一覧へ戻る
            </Link>
          </div>

          {/* 推荐相关文章 */}
          {otherPosts.length > 0 && (
            <div className="mt-24 border-t border-line pt-16">
              <h3 className="font-serif text-center text-lg text-ink">
                こちらの記事もおすすめ
              </h3>
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
                {otherPosts.map((op) => (
                  <Link
                    key={op.id}
                    href={`/journal/${op.slug}`}
                    className="group block bg-ivory p-4 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-line">
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
