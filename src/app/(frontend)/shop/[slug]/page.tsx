import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import CheckoutButton from "@/components/CheckoutButton";
import ProductCard from "@/components/ProductCard";
import { formatPrice } from "@/lib/data";
import { getProductBySlugOrId, getProducts } from "@/lib/cms";

export const dynamic = "force-dynamic";

const conditionLabels: Record<string, string> = {
  new: "新品（未使用・保管品）",
  excellent: "極美品（使用感がほとんどない状態）",
  good: "美品（目立つ傷のない良好な状態）",
  fair: "良品（日常使いに適した状態）",
};

const categoryLabels: Record<string, string> = {
  bag: "バッグ",
  jewelry: "ジュエリー",
  watch: "時計",
  accessory: "小物",
};

// 在庫状況 → 色とラベル（旧デザイントークンに状態色が無いため値を直書き）
function stockState(status: string) {
  if (status === "sold") return { label: "売約済み", color: "#8a7d72" };
  if (status === "reserved") return { label: "商談中", color: "#9a7b1f" };
  return { label: "在庫あり", color: "#3f7d5c" };
}

function conditionBadge(product: { status: string; condition: string }) {
  if (product.status === "sold") return { label: "SOLD OUT", bg: "#8a7d72" };
  if (product.condition === "new") return { label: "新品", bg: "#1f5fa8" };
  return { label: "中古", bg: "#3f7d5c" };
}

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

  const relatedProducts = (await getProducts({ category: product.category, limit: 8 }))
    .filter((p) => p.id !== product.id && p.slug !== product.slug)
    .slice(0, 4);

  const stock = stockState(product.status);
  const badge = conditionBadge(product);
  const categoryLabel = categoryLabels[product.category] || "その他";
  const taxExcluded = Math.floor(product.price / 1.1);

  // スペック表（現行のデータ項目から生成）
  const specRows: { label: string; value: React.ReactNode }[] = [
    { label: "ブランド", value: product.brand },
    { label: "カテゴリ", value: categoryLabel },
    { label: "素材・金具", value: product.spec || "—" },
    {
      label: "コンディション",
      value: conditionLabels[product.condition] || product.condition,
    },
    { label: "付属品", value: "保存袋・保証書・ブランド箱（在庫状況により異なります）" },
    { label: "在庫拠点", value: product.location },
    { label: "真贋鑑定", value: "専門鑑定士による鑑定済み／100% 正規品保証・鑑定書付き" },
    { label: "商品ID", value: product.id },
    { label: "製品名", value: `${product.brand} ${product.title}` },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-ivory pt-24 pb-24 md:pt-28">
        <div className="container-luxe">
          {/* パンくず */}
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone">
            <Link href="/" className="hover:text-ink hover:underline">
              トップ
            </Link>
            <span>&gt;</span>
            <Link href="/shop" className="hover:text-ink hover:underline">
              商品一覧
            </Link>
            <span>&gt;</span>
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-ink hover:underline"
            >
              {product.brand} {categoryLabel}
            </Link>
            <span>&gt;</span>
            <span className="text-ink/80">{product.title}</span>
          </nav>

          {/* ===== 商品メイン ===== */}
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-10">
            {/* 左：画像 */}
            <div>
              <ProductGallery images={product.images} title={product.title} />
            </div>

            {/* 右：購入パネル */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {/* ステータス */}
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-[3px] text-[11px] font-medium leading-none text-ivory"
                  style={{ backgroundColor: badge.bg }}
                >
                  {badge.label}
                </span>
                <span
                  className="text-[12px] font-medium leading-none"
                  style={{ color: stock.color }}
                >
                  {stock.label}
                </span>
                <span className="text-[12px] leading-none text-stone">{product.location}</span>
              </div>

              {/* ブランド・商品名 */}
              <p className="mt-4 text-[20px] font-medium uppercase tracking-[0.06em] text-ink">
                {product.brand}
              </p>
              <h1 className="mt-2 text-[19px] font-medium leading-snug text-ink md:text-[21px]">
                {product.title}
              </h1>
              {product.spec && (
                <p className="mt-1.5 text-[13px] leading-snug text-taupe">{product.spec}</p>
              )}

              <dl className="mt-3 space-y-0.5 text-[11px] text-stone">
                <div className="flex gap-2">
                  <dt>商品ID：</dt>
                  <dd>{product.id}</dd>
                </div>
                <div className="flex gap-2">
                  <dt>コンディション：</dt>
                  <dd>{conditionLabels[product.condition] || product.condition}</dd>
                </div>
              </dl>

              {/* サービスチップ */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["送料無料", "鑑定書付き", "全額保険付き配送", "下取り査定可"].map((chip) => (
                  <span
                    key={chip}
                    className="border border-line bg-cream px-2.5 py-1 text-[11px] leading-none text-taupe"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* 価格 */}
              <div className="mt-5 border-t border-line pt-5">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[30px] font-semibold leading-none tracking-[0.01em] text-ink md:text-[34px]">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  <span className="text-[12px] text-stone">（税込）</span>
                </p>
                <p className="mt-2 text-[12px] text-stone">
                  税抜価格 TAX FREE：{formatPrice(taxExcluded, product.currency)}
                </p>
              </div>

              {/* お支払い方法 */}
              <div className="mt-5 border border-line">
                <div className="flex">
                  <div className="flex w-[104px] shrink-0 items-center justify-center bg-cream px-3 py-3 text-[12px] leading-snug text-taupe">
                    お支払い方法
                  </div>
                  <div className="flex-1 divide-y divide-line">
                    {[
                      { name: "クレジットカード", note: "一括・分割（Stripe 安全決済）" },
                      { name: "銀行振込", note: "ご入金確認後の発送" },
                      { name: "代金引換", note: "手数料別途・国内のみ" },
                      { name: "店頭でのお支払い", note: "ご来店予約制" },
                    ].map((pay) => (
                      <div
                        key={pay.name}
                        className="flex flex-wrap items-baseline gap-x-2 px-3 py-2 text-[12px]"
                      >
                        <span className="font-medium text-ink">{pay.name}</span>
                        <span className="text-[11px] text-stone">{pay.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CART */}
              <div className="mt-4 flex items-stretch gap-2">
                <div className="flex w-[58px] shrink-0 items-center justify-center border border-line text-stone transition-colors hover:border-stone hover:text-gold">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    aria-hidden
                  >
                    <path d="M12 20.5 4.2 13a4.6 4.6 0 1 1 6.5-6.5l1.3 1.3 1.3-1.3A4.6 4.6 0 1 1 19.8 13Z" />
                  </svg>
                  <span className="sr-only">お気に入り</span>
                </div>
                <div className="flex-1">
                  <CheckoutButton productId={product.id} status={product.status} />
                </div>
              </div>

              {/* サブリンク */}
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px]">
                <Link href="/contact" className="text-ink hover:text-gold hover:underline">
                  ▶ お問い合わせ
                </Link>
                <Link href="/appraisal" className="text-ink hover:text-gold hover:underline">
                  ▶ 買取・査定サービスについて
                </Link>
                <Link href="/consignment" className="text-ink hover:text-gold hover:underline">
                  ▶ 委託販売について
                </Link>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-stone">
                実物のご確認、お支払い方法のご相談も承ります。東京・銀座サロンでのご対面確認も可能です（完全予約制）。
              </p>
            </div>
          </div>

          {/* ===== 下部コンテンツ ===== */}
          <div className="mt-14 lg:max-w-[calc(100%-470px)]">
            {/* おすすめポイント */}
            <section>
              <h2 className="border-b border-ink pb-2 text-[15px] font-medium text-ink">
                おすすめポイント
              </h2>
              <div className="mt-4 space-y-3 text-[13px] leading-[2] text-ink/80">
                <p>
                  {product.brand}「{product.title}」
                  {product.spec ? `（${product.spec}）` : ""}
                  のご紹介です。{conditionLabels[product.condition] || product.condition}
                  のお品で、現在 {product.location} の在庫となっております。
                </p>
                <p>
                  数十年の経験を持つ専門鑑定士が、フォルム・金具・刻印・レザーの状態を一点ずつ確認し、
                  100% 正規品であることを保証しております。鑑定書をお付けしてお届けいたします。
                </p>
                <p>
                  ご購入後は全額補償付きの保険配送にて、厳重に梱包のうえ発送いたします。
                  状態のご確認や追加画像のご要望は、お問い合わせより承ります。
                </p>
              </div>
            </section>

            {/* スペック */}
            <section className="mt-12">
              <h2 className="border-b border-ink pb-2 text-[15px] font-medium text-ink">
                スペック
              </h2>
              <table className="mt-4 w-full border-collapse text-[13px]">
                <tbody>
                  {specRows.map((row) => (
                    <tr key={row.label} className="border-b border-line align-top">
                      <th
                        scope="row"
                        className="w-[120px] bg-cream px-3 py-2.5 text-left font-normal text-taupe md:w-[150px]"
                      >
                        {row.label}
                      </th>
                      <td className="px-3 py-2.5 leading-relaxed text-ink/85">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* 注意事項 */}
            <section className="mt-12">
              <h2 className="border-b border-ink pb-2 text-[15px] font-medium text-ink">
                注意事項および返品・交換について
              </h2>
              <ul className="mt-4 space-y-2 text-[12px] leading-relaxed text-ink/75">
                <li>・中古品の特性上、写真では分かりにくい微細な使用感がある場合がございます。</li>
                <li>・お届けの商品が説明と著しく異なる場合、到着後 7 日以内にご連絡ください。</li>
                <li>・お客様のご都合による返品は、未使用かつ到着後 7 日以内に限り承ります。</li>
                <li>・実店舗と在庫を共有しているため、ご注文のタイミングにより品切れとなる場合がございます。</li>
              </ul>
            </section>

            {/* 店舗情報 */}
            <section className="mt-12">
              <h2 className="border-b border-ink pb-2 text-[15px] font-medium text-ink">
                店舗情報
              </h2>
              <table className="mt-4 w-full border-collapse text-[13px]">
                <tbody>
                  {[
                    { label: "店舗名", value: "brandadagio 銀座サロン" },
                    { label: "営業時間", value: "11:00 – 19:30（完全予約制）" },
                    { label: "お問い合わせ", value: "お問い合わせフォーム・LINE にて承ります" },
                    { label: "対応言語", value: "日本語・中国語・英語" },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-line align-top">
                      <th
                        scope="row"
                        className="w-[120px] bg-cream px-3 py-2.5 text-left font-normal text-taupe md:w-[150px]"
                      >
                        {row.label}
                      </th>
                      <td className="px-3 py-2.5 text-ink/85">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>

          {/* ===== 関連商品 ===== */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 border-t border-line pt-10">
              <h2 className="text-[15px] font-medium text-ink">
                RECOMMEND <span className="ml-2 text-[12px] text-stone">関連商品</span>
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
