"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface FilterBarProps {
  activeCategory: string;
  activeCondition: string;
  activeSort: string;
}

const categories = [
  { label: "すべて", value: "all" },
  { label: "バッグ", value: "bag" },
  { label: "ジュエリー", value: "jewelry" },
  { label: "時計", value: "watch" },
  { label: "小物", value: "accessory" },
];

const conditions = [
  { label: "すべての状態", value: "all" },
  { label: "新品", value: "new" },
  { label: "極美品", value: "excellent" },
  { label: "美品", value: "good" },
];

const sorts = [
  { label: "新着順", value: "newest" },
  { label: "価格：安い順", value: "price_asc" },
  { label: "価格：高い順", value: "price_desc" },
];

export default function ShopFilterBar({
  activeCategory,
  activeCondition,
  activeSort,
}: FilterBarProps) {
  const router = useRouter();

  const makeUrl = (cat = activeCategory, cond = activeCondition, s = activeSort) => {
    const q = new URLSearchParams();
    if (cat && cat !== "all") q.set("category", cat);
    if (cond && cond !== "all") q.set("condition", cond);
    if (s && s !== "newest") q.set("sort", s);
    const str = q.toString();
    return str ? `/shop?${str}` : "/shop";
  };

  return (
    <div className="mt-12 flex flex-col gap-6 border-y border-line py-6 md:flex-row md:items-center md:justify-between">
      {/* 分类切换 */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {categories.map((c) => {
          const isActive = activeCategory === c.value;
          return (
            <Link
              key={c.value}
              href={makeUrl(c.value, activeCondition, activeSort)}
              className={`rounded-full px-4 py-1.5 text-[12px] tracking-[0.14em] transition-colors ${
                isActive
                  ? "bg-gold text-ivory shadow-sm"
                  : "bg-ivory/80 text-ink/70 hover:bg-ivory hover:text-ink"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {/* 成色与排序 */}
      <div className="flex flex-wrap items-center gap-4 text-[12px] md:self-auto">
        <div className="flex items-center gap-2">
          <span className="text-ink/60">状態:</span>
          <select
            value={activeCondition}
            className="rounded border border-line bg-ivory px-3 py-1.5 text-ink focus:outline-none"
            onChange={(e) => {
              router.push(makeUrl(activeCategory, e.target.value, activeSort));
            }}
          >
            {conditions.map((cond) => (
              <option key={cond.value} value={cond.value}>
                {cond.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-ink/60">並び替え:</span>
          <select
            value={activeSort}
            className="rounded border border-line bg-ivory px-3 py-1.5 text-ink focus:outline-none"
            onChange={(e) => {
              router.push(makeUrl(activeCategory, activeCondition, e.target.value));
            }}
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
