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
      <div className="flex h-[58px] w-full cursor-not-allowed items-center justify-center bg-stone/50 text-center text-[15px] font-medium tracking-[0.08em] text-ivory">
        SOLD OUT（売約済み）
      </div>
    );
  }

  if (isReserved) {
    return (
      <div className="space-y-2">
        <div className="flex h-[58px] w-full cursor-not-allowed items-center justify-center bg-stone/50 text-center text-[15px] font-medium tracking-[0.08em] text-ivory">
          商談中（予約済み）
        </div>
        <p className="text-[11px] leading-relaxed text-stone">
          現在、他のお客様と商談中です。キャンセル待ちのご相談はお気軽にどうぞ。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="flex h-[58px] w-full items-center justify-center gap-3 bg-gold text-ivory transition-colors hover:bg-ink disabled:opacity-70"
      >
        {loading ? (
          <span className="flex items-center gap-2 text-[14px] tracking-[0.06em]">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            決済画面へ移動中…
          </span>
        ) : (
          <>
            {/* カートアイコン */}
            <svg
              className="h-6 w-6 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M2 3h2.2l2.1 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L19.5 7H5.3" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="17" cy="20" r="1.4" />
            </svg>
            <span className="text-left leading-tight">
              <span className="block text-[17px] font-medium tracking-[0.1em]">CART</span>
              <span className="block text-[11px] tracking-[0.04em] opacity-90">
                購入手続きへ
              </span>
            </span>
          </>
        )}
      </button>

      {error && (
        <p className="border border-red-200 bg-red-50 p-2.5 text-[11px] text-red-600">{error}</p>
      )}
    </div>
  );
}
