"use client";

import { useState } from "react";
import Link from "next/link";
import { faqs } from "@/lib/data";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32">
      <div className="container-luxe grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="label-en">FAQ</span>
          <h2 className="heading-jp mt-5">よくあるご質問</h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-stone">
            他にご質問がございましたら、お気軽にサポートまでお問い合わせください。
          </p>
          <Link href="/contact" className="btn-line mt-8">
            Contact
          </Link>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg text-ink">{f.q}</span>
                  <span
                    className={`shrink-0 text-2xl font-light text-gold transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-stone">
                    {f.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
