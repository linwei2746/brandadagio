"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ヒーロー最上部（未スクロール かつ メニュー閉）は明色テキスト
  const light = false;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-all duration-500 ${
        scrolled
          ? "bg-ivory/95 shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-ivory/90"
      }`}
    >

      <nav className="container-luxe flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex flex-col items-center justify-center transition-opacity hover:opacity-80 pt-1">
          <span className="font-serif text-[20px] md:text-[24px] tracking-[0.25em] text-gold uppercase leading-none ml-[0.25em]">
            <span className="text-[28px] md:text-[34px]">B</span>RANDADAGIO
          </span>
          <span className="mt-2 text-[8px] md:text-[10px] tracking-[0.45em] text-gold/85 font-medium leading-none ml-[0.45em]">
            LUXURY ASSET PLATFORM
          </span>
        </Link>

        {/* PC ナビ */}
        <ul className="hidden items-center gap-8 lg:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="font-serif text-[14px] tracking-[0.15em] text-gold transition-opacity hover:opacity-70"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA (Icons) */}
        <div className="flex items-center gap-5 md:gap-7 text-gold">
          <Link href="/mypage" aria-label="My Page" className="hidden md:block">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[22px] h-[22px] transition-opacity hover:opacity-70">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="9.5" r="3.5" />
              <path d="M6.168 18.849A4 4 0 0 1 10 15.5h4a4 4 0 0 1 3.832 3.349" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/cart" aria-label="Cart" className="hidden md:block">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 transition-opacity hover:opacity-70">
              <path d="M8 8V6a4 4 0 0 1 8 0v2" strokeLinecap="round" />
              <rect x="4" y="8" width="16" height="13" rx="2" />
            </svg>
          </Link>
          <button
            aria-label="メニュー"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              className={`h-px w-6 transition-transform ${light ? "bg-ivory" : "bg-ink"} ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 transition-opacity ${light ? "bg-ivory" : "bg-ink"} ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-6 transition-transform ${light ? "bg-ivory" : "bg-ink"} ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* モバイルメニュー */}
      <div
        className={`overflow-hidden bg-ivory transition-[max-height] duration-500 lg:hidden ${
          open ? "max-h-96 border-t border-line" : "max-h-0"
        }`}
      >
        <ul className="container-luxe flex flex-col gap-1 py-4">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-serif text-[15px] tracking-[0.15em] text-gold"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/sell" className="btn-solid mt-2 w-full">
              無料査定を申し込む
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
