import Link from "next/link";
import { getProducts, type ProductItem } from "@/lib/cms";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default async function Collection({ products }: { products?: ProductItem[] }) {
  const items = products || (await getProducts({ limit: 8 }));

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="label-en">Items</span>
          <h2 className="heading-jp mt-5">おすすめのお品</h2>
          <p className="mt-5 text-[13px] leading-relaxed tracking-[0.02em] text-ink/60 md:text-sm">
            鑑定を経た、確かなエルメスを一点ずつ。
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/shop" className="btn-view">
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
