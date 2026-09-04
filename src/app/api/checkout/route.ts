import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { getStripe } from "@/lib/stripe";
import { collection as mockProducts, featuredProducts as mockFeatured } from "@/lib/data";

export const dynamic = "force-dynamic";

// ゼロ十進通貨（JPY 等は最小単位＝そのまま）
const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND"]);

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const payload = await getPayload({ config });
    let product: any = null;

    // 1. Payload 内で ID 検索
    try {
      product = await payload.findByID({ collection: "products", id: productId });
    } catch {
      // ignore
    }

    // 2. Payload 内で slug 検索
    if (!product) {
      try {
        const found = await payload.find({
          collection: "products",
          where: { slug: { equals: productId } },
          limit: 1,
        });
        if (found.docs && found.docs.length > 0) {
          product = found.docs[0];
        }
      } catch {
        // ignore
      }
    }

    let title = "";
    let price = 0;
    let currency = "JPY";
    let slug = String(productId);

    if (product) {
      if (product.status !== "available") {
        return NextResponse.json({ error: "現在在庫がないか商談中のお品です" }, { status: 409 });
      }
      title = product.title;
      price = product.price;
      currency = String(product.currency || "JPY");
      slug = product.slug || String(product.id);
    } else {
      // 3. データベース未投入時のデモデータフォールバック
      const mockAll = [...mockProducts, ...mockFeatured];
      const mock = mockAll.find((m) => m.id === productId || m.name === productId);
      if (mock) {
        title = mock.name;
        price = mock.price;
        currency = mock.currency || "JPY";
        slug = mock.id;
      } else {
        return NextResponse.json({ error: "商品が見つかりません" }, { status: 404 });
      }
    }

    const unitAmount = ZERO_DECIMAL.has(currency)
      ? Math.round(price)
      : Math.round(price * 100);

    // 先に pending 注文を作成
    const orderData: any = {
      items: [
        {
          title,
          price,
          ...(product ? { product: product.id } : {}),
        },
      ],
      total: price,
      currency,
      status: "pending",
    };

    let orderId = `order_${Date.now()}`;
    try {
      const order = await payload.create({
        collection: "orders",
        data: orderData,
      });
      orderId = String(order.id);
    } catch (orderErr) {
      console.warn("[checkout] order creation in db failed, using fallback ID:", orderErr);
    }

    const origin = process.env.NEXT_PUBLIC_SERVER_URL || new URL(req.url).origin;

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: unitAmount,
            product_data: { name: title },
          },
        },
      ],
      success_url: `${origin}/checkout/success?o=${orderId}`,
      cancel_url: `${origin}/shop/${slug}`,
      metadata: {
        orderId,
        productId: product ? String(product.id) : String(productId),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "決済の開始に失敗しました" }, { status: 500 });
  }
}
