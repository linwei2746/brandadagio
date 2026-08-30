// ============================================================
//  サイト全体の設定 — ブランド名・連絡先などはここで一括変更
// ============================================================

export const siteConfig = {
  name: "brandadagio",
  nameJa: "ブランド・アダージョ",
  tagline: "ラグジュアリーアイテムの価値を最大限に。",
  description:
    "エルメスをはじめとするラグジュアリーバッグの販売・買取・委託販売。専門鑑定士による真贋鑑定と、世界規模のネットワークで、大切なお品の価値を最大化します。",
  // 主要導線
  nav: [
    { label: "ショップ", href: "/shop" },
    { label: "買取", href: "/sell" },
    { label: "委託販売", href: "/consignment" },
    { label: "メンバーシップ", href: "/membership" },
    { label: "店舗", href: "/stores" },
  ],
  contact: {
    email: "contact@maison-reserve.example",
    tel: "03-0000-0000",
    hours: "11:00 - 19:45（不定休）",
  },
  social: {
    instagram: "#",
    line: "#",
    wechat: "#",
  },
} as const;

export type SiteConfig = typeof siteConfig;
