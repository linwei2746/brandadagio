import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/data";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.id}`} className="group block text-center">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-ivory">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-gold/90 px-3 py-1 text-[10px] tracking-[0.14em] text-ivory">
            {product.badge}
          </span>
        )}
      </div>
      <div className="mt-6 space-y-2">
        <h3 className="font-mincho text-[15px] font-normal leading-snug tracking-[0.16em] text-ink transition-colors group-hover:text-gold">
          {product.name}
        </h3>
        <p className="text-[10px] leading-snug tracking-[0.12em] text-stone">
          {product.spec}
        </p>
        <p className="price pt-1">{formatPrice(product.price, product.currency)}</p>
      </div>
    </Link>
  );
}
