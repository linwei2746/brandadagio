"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe max-w-2xl">
          <div className="text-center">
            <span className="label-en">Inquiries</span>
            <h1 className="heading-jp mt-4">お問い合わせ</h1>
            <p className="mt-4 text-xs tracking-wider text-ink/60 md:text-sm">
              商品についてのご質問、ご来店のご予約、資産管理のご相談など、お気軽にお問い合わせください。
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
                <h3 className="heading-jp mt-4 text-lg">お問い合わせを受け付けました</h3>
                <p className="mt-3 text-xs text-ink/75 leading-relaxed">
                  内容を確認の上、担当スタッフより2営業日以内にご連絡差し上げます。
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn-outline mt-6 inline-flex text-xs"
                >
                  別のお問い合わせをする
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
                  <label className="block text-ink/80 mb-2 font-medium">メールアドレス</label>
                  <input
                    type="email"
                    required
                    placeholder="example@domain.com"
                    className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-ink/80 mb-2 font-medium">お問い合わせ種別</label>
                  <select className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none">
                    <option>商品についてのお問い合わせ</option>
                    <option>銀座サロンご来店予約</option>
                    <option>買取・委託販売のご相談</option>
                    <option>メンバーシップについて</option>
                    <option>その他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-ink/80 mb-2 font-medium">お問い合わせ内容</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="ご質問やご要望をご記入ください。"
                    className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-gold w-full justify-center py-4 text-center tracking-[0.2em]"
                  >
                    送信する
                  </button>
                </div>
              </form>
            )}

            <div className="mt-10 border-t border-line pt-8 text-center text-xs text-ink/60 space-y-2">
              <p>お電話でのお問い合わせ: <span className="text-ink font-medium">{siteConfig.contact.tel}</span></p>
              <p>受付時間: {siteConfig.contact.hours}</p>
              <p>メール: {siteConfig.contact.email}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
