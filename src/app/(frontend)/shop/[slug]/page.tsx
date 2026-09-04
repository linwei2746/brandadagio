import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import CheckoutButton from "@/components/CheckoutButton";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { formatPrice } from "@/lib/data";
import { getProductBySlugOrId, getProducts } from "@/lib/cms";

export const dynamic = "force-dynamic";

const conditionLabels: Record<string, string> = {
  new: "新品（未使用・保管品）",
  excellent: "極美品（使用感がほとんどない状態）",
  good: "美品（目立つ傷のない良好な状態）",
  fair: "良品（日常使いに適した状態）",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlugOrId(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getProducts({ limit: 4 })).filter(
    (p) => p.id !== product.id && p.slug !== product.slug
  ).slice(0, 4);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 pb-28 md:pt-32">
        <div className="container-luxe">
          {/* 面包屑 */}
          <nav className="flex items-center gap-2 text-xs tracking-wider text-ink/50">
            <Link href="/" className="hover:text-ink">
              HOME
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-ink">
              SHOP
            </Link>
            <span>/</span>
            <span className="text-ink/80">{product.title}</span>
          </nav>

          {/* 商品主区域 */}
          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* 左侧：相册 */}
            <div className="lg:col-span-7">
              <ProductGallery images={product.images} title={product.title} />
            </div>

            {/* 右侧：信息与购买 */}
            <div className="flex flex-col justify-between lg:col-span-5">
              <div className="space-y-6">
                <div>
                  <span className="label-en tracking-widest text-gold">
                    {product.brand}
                  </span>
                  <h1 className="font-mincho mt-2 text-2xl font-normal tracking-[0.12em] text-ink md:text-3xl">
                    {product.title}
                  </h1>
                </div>

                <div className="border-b border-line pb-6">
                  <p className="price text-2xl md:text-3xl">
                    {formatPrice(product.price, product.currency)}
                  </p>
                  <p className="mt-1 text-xs text-stone">消費税込・配送料無料</p>
                </div>

                {/* 详细参数表 */}
                <div className="space-y-3 divide-y divide-line text-xs tracking-wider">
                  <div className="flex justify-between pt-3">
                    <span className="text-ink/60">状態</span>
                    <span className="font-medium text-ink">
                      {conditionLabels[product.condition] || product.condition}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-ink/60">素材・金具</span>
                    <span className="text-ink">{product.spec || "—"}</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-ink/60">在庫拠点</span>
                    <span className="text-ink">{product.location}</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-ink/60">配送</span>
                    <span className="text-ink">全額保険付き・厳重梱包にて即日〜2日発送</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-ink/60">真贋鑑定</span>
                    <span className="font-medium text-gold">
                      100% 正規品保証・鑑定書付き
                    </span>
                  </div>
                </div>

                {/* 购买与在线结账按钮 */}
                <div className="pt-4">
                  <CheckoutButton productId={product.id} status={product.status} />
                </div>

                {/* 咨询专属顾问 */}
                <div className="rounded border border-line bg-ivory/60 p-5 text-center">
                  <p className="text-xs text-ink/80">
                    実物のご確認や、お支払い方法（銀行振込・分割）のご相談
                  </p>
                  <div className="mt-3 flex justify-center gap-3">
                    <Link
                      href="/contact"
                      className="border border-gold px-5 py-2 text-xs tracking-[0.12em] text-gold transition-colors hover:bg-gold hover:text-ivory"
                    >
                      お問い合わせ
                    </Link>
                    <a
                      href="https://line.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-ink/20 px-5 py-2 text-xs tracking-[0.12em] text-ink/80 transition-colors hover:border-ink hover:text-ink"
                    >
                      LINE で相談
                    </a>
                  </div>
                </div>
              </div>

              {/* 品质保障承诺 */}
              <div className="mt-10 border-t border-line pt-6">
                <h3 className="font-serif text-xs font-semibold tracking-widest text-ink/70 uppercase">
                  brandadagio の安心保証
                </h3>
                <ul className="mt-3 space-y-2 text-[11px] text-ink/60">
                  <li>・数十年の経験を持つ専門鑑定士による厳格な真贋鑑定済み</li>
                  <li>・全額補償付きの保険配送で、確実にお手元までお届け</li>
                  <li>・東京・銀座サロンでのご対面確認も可能（完全予約制）</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 推荐同类商品 */}
          {relatedProducts.length > 0 && (
            <div className="mt-28 border-t border-line pt-20">
              <Reveal className="text-center">
                <span className="label-en">Recommend</span>
                <h2 className="heading-jp mt-3">おすすめのコレクション</h2>
              </Reveal>
              <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
