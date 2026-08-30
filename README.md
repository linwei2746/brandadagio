# MAISON RESERVE — ラグジュアリー販売・買取・委託販売サイト

エルメスをはじめとするラグジュアリーバッグの **販売・買取・委託販売** を行うウェブサイトです。
[ginzaxiaoma.com](https://ginzaxiaoma.com/ja) を参考に、Next.js + Supabase + Vercel の構成で構築しています。

現在は **トップページ（日本語）** が完成しており、商品一覧・買取フォーム・会員機能などへ段階的に拡張できる土台になっています。

---

## 技術スタック

| 層 | 採用技術 |
|----|----------|
| フレームワーク | Next.js 14（App Router） |
| 言語 | TypeScript |
| スタイル | Tailwind CSS |
| フォント | Cormorant Garamond ＋ Noto Serif / Sans JP（`next/font`） |
| データベース / 認証 | Supabase（PostgreSQL ＋ Auth ＋ RLS） |
| ホスティング | Vercel |

---

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` を `.env.local` にコピーし、Supabase の値を入れます。

```bash
cp .env.example .env.local
```

| 変数 | 取得場所 |
|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase ダッシュボード → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 同上（anon public キー） |
| `SUPABASE_SERVICE_ROLE_KEY` | 同上（service_role キー・**公開厳禁**） |

> Supabase をまだ用意していなくても、トップページはデモデータ（`src/lib/data.ts`）で動作します。

### 3. 開発サーバーの起動

```bash
npm run dev
```

→ http://localhost:3000

### 4. 本番ビルドの確認

```bash
npm run build
```

---

## Supabase の準備

1. [supabase.com](https://supabase.com) でプロジェクトを作成
2. ダッシュボードの **SQL Editor** に [`supabase/schema.sql`](supabase/schema.sql) を貼り付けて実行
   - `products`（販売在庫）／`sell_requests`（買取・委託の査定申込）／`inquiries`（問い合わせ）テーブルと RLS を作成します
3. API キーを `.env.local` に設定

クライアントの使い方:

```ts
// サーバーコンポーネント / Route Handler
import { createClient } from "@/lib/supabase/server";
// クライアントコンポーネント
import { createClient } from "@/lib/supabase/client";
```

---

## Vercel へのデプロイ

1. このリポジトリを GitHub に push
2. [vercel.com](https://vercel.com) で **New Project** → リポジトリを import
3. **Environment Variables** に `.env.local` と同じ 3 つの値を登録
4. Deploy（以降は `main` への push で自動デプロイ）

---

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx        # 共通レイアウト・フォント・メタデータ
│   ├── page.tsx          # トップページ（各セクションを組み立て）
│   └── globals.css       # Tailwind ＋ 共通スタイル（ボタン等）
├── components/           # セクション単位のコンポーネント
│   ├── Header.tsx / Footer.tsx
│   ├── Hero.tsx / ServicesBar.tsx / WhyUs.tsx
│   ├── FeaturedProducts.tsx / Collection.tsx / ProductCard.tsx
│   ├── Membership.tsx / SellCTA.tsx / RequestService.tsx
│   ├── Stats.tsx / Stores.tsx / BeyondServices.tsx
│   ├── FAQ.tsx / Journal.tsx / Reveal.tsx
├── lib/
│   ├── site.ts           # ★ブランド名・連絡先・ナビをここで一括変更
│   ├── data.ts           # デモ用データ（商品・店舗・FAQ 等）
│   └── supabase/         # Supabase クライアント（client / server）
supabase/
└── schema.sql            # DB スキーマ ＋ RLS ポリシー
```

## カスタマイズの入口

- **ブランド名・連絡先・ナビ** … [`src/lib/site.ts`](src/lib/site.ts)
- **配色（墨色・クリーム・ゴールド等）／フォント** … [`tailwind.config.ts`](tailwind.config.ts)
- **掲載する商品・店舗・FAQ・記事** … [`src/lib/data.ts`](src/lib/data.ts)
  （本番では Supabase から取得する実装に差し替え）
- **画像** … 現在は Unsplash のプレースホルダー。実在庫の写真に差し替えてください。

---

## 次のステップ（拡張ロードマップ）

- [ ] 商品一覧 `/shop`（検索・カテゴリ絞り込み・ページネーション）
- [ ] 商品詳細 `/shop/[id]`（多角度画像・SSR で SEO 対応）
- [ ] 買取・委託の申込フォーム `/sell`（画像アップロード → Supabase Storage）
- [ ] ユーザー認証（Supabase Auth）とマイページ（申込状況の確認）
- [ ] 鑑定士向け管理画面（査定・価格設定）
- [ ] 決済連携（決済代行 ／ 将来的に微信・支付宝）
- [ ] 多言語対応（日 → 中・英）

---

## 注記

- 掲載中の商品名・ブランド・価格・画像はすべて **デモ用のプレースホルダー** です。実運用前に自社の在庫情報へ差し替えてください。
- `next` は既知の脆弱性を修正した 14.2 系のパッチ版を使用しています。定期的に `npm audit` で確認してください。
