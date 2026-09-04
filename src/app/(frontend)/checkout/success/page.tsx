import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getOrderById } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const orderId = typeof params.o === "string" ? params.o : undefined;

  let order: any = null;
  if (orderId) {
    order = await getOrderById(orderId);
  }

  const orderNo = order?.orderNo || orderId || "BA-CONFIRMED";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-32 pb-32">
        <div className="container-luxe max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <span className="label-en mt-6 block text-gold">PAYMENT SUCCESSFUL</span>
          <h1 className="heading-jp mt-3">ご注文ありがとうございます</h1>

          <div className="mt-8 rounded border border-line bg-ivory p-8 text-left shadow-sm">
            <div className="border-b border-line pb-4">
              <span className="text-xs text-ink/50">注文番号</span>
              <p className="font-mono mt-1 text-base font-semibold text-gold">
                {orderNo}
              </p>
            </div>

            <div className="mt-6 space-y-3 text-xs leading-relaxed text-ink/80">
              <p>
                お支払いが正常に完了いたしました。ご登録のメールアドレス宛に注文確認メールをお送りしております。
              </p>
              <p>
                お品は当社の専門鑑定士による最終検品の後、全額保険付きの厳重配送にて速やかに発送いたします。発送完了時にお荷物追跡番号をお知らせいたします。
              </p>
            </div>

            {order?.items && Array.isArray(order.items) && (
              <div className="mt-6 border-t border-line pt-4">
                <span className="text-xs font-medium text-ink/60">ご注文内容</span>
                <ul className="mt-2 divide-y divide-line/60">
                  {order.items.map((item: any, i: number) => (
                    <li key={i} className="flex justify-between py-2 text-xs">
                      <span className="text-ink">{item.title}</span>
                      <span className="font-medium text-ink">
                        ¥ {Number(item.price).toLocaleString("ja-JP")}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-line pt-3 text-sm font-semibold">
                  <span>合計</span>
                  <span className="text-gold">
                    ¥ {Number(order.total).toLocaleString("ja-JP")}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/shop" className="btn-gold">
              ショッピングを続ける
            </Link>
            <Link
              href="/"
              className="border border-line bg-ivory px-8 py-3 text-xs tracking-[0.14em] text-ink transition-colors hover:border-gold"
            >
              トップページへ戻る
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
