"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  productId: string;
  status: string;
}

export default function CheckoutButton({ productId, status }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSold = status === "sold";
  const isReserved = status === "reserved";

  const handleCheckout = async () => {
    if (isSold || isReserved || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "決済の初期化に失敗しました");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "エラーが発生しました。もう一度お試しください。");
      setLoading(false);
    }
  };

  if (isSold) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed bg-stone/40 py-4 text-center font-serif text-sm tracking-[0.2em] text-ivory/80 uppercase"
      >
        SOLD OUT（売約済み）
      </button>
    );
  }

  if (isReserved) {
    return (
      <div className="space-y-3">
        <button
          disabled
          className="w-full cursor-not-allowed bg-gold/50 py-4 text-center font-serif text-sm tracking-[0.2em] text-ivory uppercase"
        >
          商談中（予約済み）
        </button>
        <p className="text-center text-xs text-ink/60">
          現在他のお客様との商談中です。キャンセル待ちのお問い合わせはお気軽にご連絡ください。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden bg-gold py-4 text-center font-serif text-[14px] tracking-[0.2em] text-ivory shadow-md transition-all hover:bg-gold/90 disabled:opacity-75"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin text-ivory"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            決済画面へ移動中...
          </span>
        ) : (
          <span>購入手続きへ（Stripe 安全決済）</span>
        )}
      </button>

      {error && (
        <p className="rounded bg-red-50 p-3 text-center text-xs text-red-600">
          {error}
        </p>
      )}

      <p className="text-center text-[11px] text-ink/50">
        ※ 配送保険付き・送料無料・100%正規品鑑定保証付き
      </p>
    </div>
  );
}
