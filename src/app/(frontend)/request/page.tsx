"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RequestPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe max-w-2xl">
          <div className="text-center">
            <span className="label-en">Sourcing Service</span>
            <h1 className="heading-jp mt-4">商品リクエスト</h1>
            <p className="mt-4 text-xs tracking-wider text-ink/60 md:text-sm">
              お探しのモデル、カラー、素材、金具がございましたら、専任チームが世界各地のネットワークよりお探しいたします。
            </p>
          </div>

          <div className="mt-12 rounded border border-line bg-ivory p-8 shadow-sm md:p-12">
            {submitted ? (
              <div className="text-center py-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="heading-jp mt-4 text-lg">リクエストを受け付けました</h3>
                <p className="mt-3 text-xs text-ink/75 leading-relaxed">
                  ご希望条件をもとに世界各都市の在庫状況を確認し、専任コンシェルジュよりご連絡差し上げます。
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn-outline mt-6 inline-flex text-xs"
                >
                  別のリクエストを送信する
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-6 text-xs"
              >
                <div>
                  <label className="block text-ink/80 mb-2 font-medium">お名前</label>
                  <input
                    type="text"
                    required
                    placeholder="山田 太郎"
                    className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-ink/80 mb-2 font-medium">ご連絡先（メールまたはお電話）</label>
                  <input
                    type="text"
                    required
                    placeholder="example@domain.com / 090-0000-0000"
                    className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-ink/80 mb-2 font-medium">ご希望のお品（モデル名・サイズ）</label>
                  <input
                    type="text"
                    required
                    placeholder="例: バーキン 25 / ケリー 28 / ミニケリー など"
                    className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-ink/80 mb-2 font-medium">ご希望のカラー・素材・金具・ご予算</label>
                  <textarea
                    rows={4}
                    placeholder="カラー（ブラック、エトゥープ、ゴールド等）、素材（トゴ、エプソン等）、金具（ゴールド/シルバー）、ご予算の目安などをご記入ください。"
                    className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-gold w-full justify-center py-4 text-center tracking-[0.2em]"
                  >
                    リクエストを送信する
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
