import type Stripe from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

// Stripe Webhook は生のボディで署名検証する必要がある
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return new Response("missing signature/secret", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("[webhook] signature error", err);
    return new Response("bad signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const orderId = s.metadata?.orderId;
    const productId = s.metadata?.productId;

    try {
      const payload = await getPayload({ config });
      if (orderId) {
        await payload.update({
          collection: "orders",
          id: orderId,
          data: {
            status: "paid",
            stripeSessionId: s.id,
            paidAt: new Date().toISOString(),
            customer: {
              name: s.customer_details?.name || undefined,
              email: s.customer_details?.email || undefined,
            },
          },
        });
      }
      if (productId) {
        await payload.update({
          collection: "products",
          id: productId,
          data: { status: "sold" },
        });
      }
      // TODO: 確認メール送信（Resend 等）
    } catch (err) {
      console.error("[webhook] update failed", err);
      return new Response("update failed", { status: 500 });
    }
  }

  return new Response("ok", { status: 200 });
}
