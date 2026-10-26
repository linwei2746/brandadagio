import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/data";
import type { ProductItem } from "@/lib/cms";

type CardProduct = Product | ProductItem;

// 状態 → バッジの色・ラベル
// （色は旧デザイントークンに無いため、このコンポーネント内で完結させる）
function statusBadge(product: CardProduct) {
  const status = "status" in product ? product.status : undefined;
  if (status === "sold") return { label: "SOLD OUT", bg: "#8a7d72" };
  if (status === "reserved") return { label: "商談中", bg: "#9a7b1f" };
  const condition = "condition" in product ? product.condition : undefined;
  if (condition === "new") return { label: "新品", bg: "#1f5fa8" };
  return { label: "中古", bg: "#3f7d5c" };
}

export default function ProductCard({ product }: { product: CardProduct }) {
  const name = "title" in product ? product.title : product.name;
  const href =
    "slug" in product && product.slug ? `/shop/${product.slug}` : `/shop/${product.id}`;
  const brand = "brand" in product && product.brand ? product.brand : "HERMÈS";
  const isSold = "status" in product && product.status === "sold";
  const badge = statusBadge(product);
  const location = "location" in product ? product.location : undefined;

  return (
    <Link href={href} className="group block text-left">
      {/* 画像 */}
      <div className="relative aspect-square overflow-hidden border border-line bg-ivory">
        <Image
          src={product.image || "/img/1788083506887.png"}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.04] ${
            isSold ? "opacity-60" : ""
          }`}
        />
        {/* 左上のステータスバッジ */}
        <span
          className="absolute left-0 top-0 px-2.5 py-[3px] text-[11px] font-medium leading-none text-ivory"
          style={{ backgroundColor: badge.bg }}
        >
          {badge.label}
        </span>
      </div>

      {/* 情報 */}
      <div className="mt-2.5">
        {/* 在庫タグ */}
        <p className="text-[11px] font-medium leading-none">
          {isSold ? (
            <span className="text-stone">売約済み</span>
          ) : (
            <span style={{ color: "#3f7d5c" }}>在庫あり</span>
          )}
          {location && <span className="ml-2 text-stone">{location}</span>}
        </p>

        {/* ブランド */}
        <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.04em] text-ink">
          {brand}
        </p>

        {/* 商品名 */}
        <h3 className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-ink/90 transition-colors group-hover:text-stone">
          {name}
        </h3>

        {/* 仕様 */}
        {product.spec && (
          <p className="mt-1.5 line-clamp-1 text-[11px] leading-snug text-stone">
            {product.spec}
          </p>
        )}

        {/* 価格 */}
        <p className="mt-2">
          <span className="font-sans text-[17px] font-medium tracking-[0.01em] text-ink">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="ml-1 text-[11px] text-stone">(税込)</span>
        </p>
      </div>
    </Link>
  );
}
