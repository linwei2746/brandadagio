import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/data";
import type { ProductItem } from "@/lib/cms";

type CardProduct = Product | ProductItem;

export default function ProductCard({ product }: { product: CardProduct }) {
  const name = "title" in product ? product.title : product.name;
  const href = "slug" in product && product.slug ? `/shop/${product.slug}` : `/shop/${product.id}`;
  const isSold = "status" in product && product.status === "sold";
  const badgeText = isSold ? "SOLD OUT" : product.badge;

  return (
    <Link href={href} className="group block text-center">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-ivory">
        <Image
          src={product.image || "/img/1788083506887.png"}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {badgeText && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] tracking-[0.14em] ${
              isSold ? "bg-stone/90 text-ivory" : "bg-gold/90 text-ivory"
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>
      <div className="mt-6 space-y-2">
        <h3 className="font-mincho text-[15px] font-normal leading-snug tracking-[0.16em] text-ink transition-colors group-hover:text-gold">
          {name}
        </h3>
        <p className="text-[10px] leading-snug tracking-[0.12em] text-stone">
          {product.spec}
        </p>
        <p className="price pt-1">{formatPrice(product.price, product.currency)}</p>
      </div>
    </Link>
  );
}
