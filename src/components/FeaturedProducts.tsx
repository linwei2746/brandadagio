import Link from "next/link";
import { featuredProducts } from "@/lib/data";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default function FeaturedProducts() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-luxe">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">MEMBERS ONLY CONSIGNMENT</p>
            <h2 className="heading mt-4">会員限定 委託販売</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone">
              認定パートナーによる特別なご案内。一般公開前の希少なお品をご紹介します。
            </p>
          </div>
          <Link href="/consignment" className="link-underline shrink-0">
            委託販売について →
          </Link>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {featuredProducts.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
