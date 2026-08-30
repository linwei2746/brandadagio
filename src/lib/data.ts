// ============================================================
//  デモ用データ
//  本番では Supabase から取得します（lib/supabase を参照）。
//  画像は Unsplash のプレースホルダーを使用しています。
// ============================================================

export type Product = {
  id: string;
  name: string;
  spec: string; // 素材・金具など
  location: string; // 在庫拠点
  price: number;
  currency: "JPY" | "HKD";
  image: string;
  badge?: string; // 「新入荷」「希少」など
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

// 会員限定・委託販売のハイライト
export const featuredProducts: Product[] = [
  {
    id: "f1",
    name: "ミニ ケリー",
    spec: "エプソン ゴールド金具",
    location: "東京",
    price: 2648800,
    currency: "JPY",
    image: img("photo-1584917865442-de89df76afd3"),
    badge: "希少",
  },
  {
    id: "f2",
    name: "ケリー 32",
    spec: "トゴ シルバー金具",
    location: "東京",
    price: 2021800,
    currency: "JPY",
    image: img("photo-1548036328-c9fa89d128fa"),
  },
  {
    id: "f3",
    name: "ケリー 25 HSS",
    spec: "エプソン 特注金具",
    location: "香港",
    price: 6597800,
    currency: "JPY",
    image: img("photo-1594223274512-ad4803739b7c"),
    badge: "限定",
  },
  {
    id: "f4",
    name: "ヴェルー ミニ",
    spec: "シェーブル ゴールド金具",
    location: "香港",
    price: 32880,
    currency: "HKD",
    image: img("photo-1614179689702-355944cd0918"),
  },
];

// 厳選コレクション
export const collection: Product[] = [
  {
    id: "c1",
    name: "バーキン 30 ブラック",
    spec: "トゴ シルバー金具",
    location: "東京",
    price: 4649266,
    currency: "JPY",
    image: "/img/1788083506887.png",
    badge: "新入荷",
  },
  {
    id: "c2",
    name: "ケリー 28 グリ",
    spec: "スイフト パラジウム金具",
    location: "東京",
    price: 3054650,
    currency: "JPY",
    image: "/img/1788083515162.png",
  },
  {
    id: "c3",
    name: "ミニ ケリー ローズ",
    spec: "シェーブル ゴールド金具",
    location: "香港",
    price: 2648800,
    currency: "JPY",
    image: "/img/1788083529107.png",
  },
  {
    id: "c4",
    name: "ケリー 25 ルージュアッシュ",
    spec: "ボックスカーフ ゴールド金具",
    location: "東京",
    price: 4649266,
    currency: "JPY",
    image: "/img/1788083549473.png",
    badge: "希少",
  },
  {
    id: "c5",
    name: "リンディ ミニ ナタ",
    spec: "スイフト ゴールド金具",
    location: "大阪",
    price: 1380000,
    currency: "JPY",
    image: "/img/1788083502310.png",
  },
  {
    id: "c6",
    name: "コンスタンス スリム ゴールド",
    spec: "エプソン ゴールド金具",
    location: "香港",
    price: 998000,
    currency: "JPY",
    image: "/img/1788083522155.png",
  },
  {
    id: "c7",
    name: "ピクニック ケリー ナチュラル",
    spec: "オジェ 編み込み ゴールド金具",
    location: "大阪",
    price: 6597800,
    currency: "JPY",
    image: "/img/1788083542753.png",
    badge: "限定",
  },
  {
    id: "c8",
    name: "ケリー ミニ クロコ マロン",
    spec: "ポロサス マット ゴールド金具",
    location: "シンガポール",
    price: 8980000,
    currency: "JPY",
    image: "/img/1788083497989.png",
  },
];

// 選ばれる理由
export const reasons = [
  {
    title: "真贋鑑定",
    body: "数十年の経験を持つ専門鑑定士が、フォルム・金具・刻印・レザーを厳格に鑑定します。",
  },
  {
    title: "グローバルネットワーク",
    body: "東京・大阪・香港・シンガポール・ドバイ・パリを結ぶ国際流通網。",
  },
  {
    title: "委託販売",
    body: "世界中のコレクターへお品をご紹介し、売却の可能性を最大化します。",
  },
  {
    title: "専任アドバイザー",
    body: "資産価値を見据えた、コレクション管理の戦略的なご提案。",
  },
];

// 実績
export const stats = [
  { value: "15+", label: "年の実績" },
  { value: "30,000+", label: "取引実績" },
  { value: "6", label: "グローバル拠点" },
  { value: "100%", label: "正規品鑑定保証" },
];

// 店舗
export const stores = [
  { city: "東京", area: "東京都中央区銀座", hours: "11:00 - 19:45" },
  { city: "大阪 梅田", area: "大阪市北区梅田", hours: "11:00 - 20:00（月〜土）" },
  { city: "香港", area: "Central, Hong Kong Island", hours: "10:30 - 19:30" },
  { city: "シンガポール", area: "オーチャードロード", hours: "10:00 - 19:00" },
  { city: "ドバイ", area: "ビジネスベイ, ドバイ", hours: "10:00 - 19:00（月〜土）" },
  { city: "パリ", area: "オペラ地区, パリ", hours: "11:00 - 19:00（月〜金）" },
];

// 売買を超えたサービス
export const beyondServices = [
  { title: "鑑定", body: "社内専門家による厳格な鑑定および詳細証明書の発行。" },
  { title: "レンタル", body: "ご購入前のご体験や特別な機会のための柔軟なレンタル。" },
  { title: "ファイナンス", body: "条件を満たすお客様向けの柔軟なファイナンスオプション。" },
  { title: "査定", body: "保険・相続・市場評価のための専門査定サービス。" },
];

// よくあるご質問
export const faqs = [
  {
    q: "商品が正規品であることをどう確認できますか？",
    a: "販売するすべての商品は、数十年の経験を持つ社内鑑定専門家が鑑定し、詳細な鑑定証明書を発行します。すべての購入に100%正規品保証が付いています。",
  },
  {
    q: "委託販売のプロセスは？",
    a: "オンライン査定を提出し、商品をお送りください（送料は当社負担）。鑑定士による最終評価後、グローバルバイヤーネットワークに出品します。売却後、速やかにお支払いします。",
  },
  {
    q: "国際配送は可能ですか？",
    a: "はい。東京・大阪・香港・シンガポール・ドバイ・パリから世界中へ発送しています。通関書類の処理から、安全で保険付きの配送まで対応します。",
  },
  {
    q: "バッグを売却するのにどれくらいかかりますか？",
    a: "買取の場合、24時間以内にオンライン初回査定が可能で、最終鑑定後は即時お支払い。委託販売は商品により異なりますが、個人売却より迅速な場合が多いです。",
  },
  {
    q: "お持ちのバッグを別の商品と交換できますか？",
    a: "はい。下取りサービスをご利用いただけます。お持ちの商品を評価し、その価値を新しい商品の購入に充当できます。",
  },
];

// ジャーナル
export const journal = [
  {
    title: "なぜ専門鑑定が重要なのか？累計200万点の鑑定実績が意味すること",
    excerpt:
      "豊富な実物経験が取引リスクの軽減や正確な判断にどうつながるのか。累計200万件の鑑定実績が意味する専門性について解説します。",
    date: "2026-08-12",
    image: img("photo-1483985988355-763728e1935b"),
  },
  {
    title: "本物のエルメスを見分けるには？専門鑑定のチェックポイント",
    excerpt:
      "バッグのフォルム、金具、刻印、レザー、内部構造など、専門鑑定でどこを確認するのかを詳しく解説します。",
    date: "2026-07-28",
    image: img("photo-1490481651871-ab68de25d43d"),
  },
  {
    title: "Luxury Beyond Ownership — 所有を超えたラグジュアリーの価値",
    excerpt:
      "ラグジュアリーの価値は、所有することだけでは完結しない。私たちが掲げるひとつの理念についてご紹介します。",
    date: "2026-07-05",
    image: img("photo-1441986300917-64674bd600d8"),
  },
];

// 価格フォーマット（DEAREST 風：¥ 000,000 〜）
export function formatPrice(price: number, currency: "JPY" | "HKD") {
  const symbol = currency === "JPY" ? "¥" : "HK$";
  return `${symbol} ${price.toLocaleString("ja-JP")} 〜`;
}
