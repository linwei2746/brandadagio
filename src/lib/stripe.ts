import Stripe from "stripe";

// 遅延生成：ビルド時（キー未設定）にモジュール読み込みで落ちないようにする
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  if (!_stripe) _stripe = new Stripe(key);
  return _stripe;
}
