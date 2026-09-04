import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import ShopFilterBar from "@/components/ShopFilterBar";
import { getProducts } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const activeCategory = typeof params.category === "string" ? params.category : "all";
  const activeCondition = typeof params.condition === "string" ? params.condition : "all";
  const activeSort = typeof params.sort === "string" ? params.sort : "newest";

  const products = await getProducts({
    category: activeCategory !== "all" ? activeCategory : undefined,
    condition: activeCondition !== "all" ? activeCondition : undefined,
    sort: activeSort,
    limit: 60,
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe">
          {/* 页面标题 */}
          <div className="text-center">
            <span className="label-en">Shop Collection</span>
            <h1 className="heading-jp mt-4">コレクション一覧</h1>
            <p className="mt-4 text-xs tracking-wider text-ink/60 md:text-sm">
              厳格な鑑定を経た、確かなエルメス・ラグジュアリーアイテムを世界各地から。
            </p>
          </div>

          {/* 筛选与排序导航条 */}
          <ShopFilterBar
            activeCategory={activeCategory}
            activeCondition={activeCondition}
            activeSort={activeSort}
          />

          {/* 商品列表 Grid */}
          {products.length > 0 ? (
            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product, i) => (
                <Reveal key={product.id} delay={(i % 4) * 60}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-base text-ink/60">
                該当するお品が見つかりませんでした。
              </p>
              <Link href="/shop" className="btn-gold mt-6 inline-flex">
                全商品を見る
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
