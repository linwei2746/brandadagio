# brandadagio — ラグジュアリー販売・買取・委託販売サイト

エルメスをはじめとするラグジュアリーバッグの **販売・買取・委託販売** を行うウェブサイトです。

商品・ブログの更新は **Payload CMS の管理画面からノーコードで**行えます。
決済は Stripe Checkout（ホスト型）を利用し、カード情報はサーバーを通りません。

---

## 技術スタック

| 層 | 採用技術 |
|----|----------|
| フレームワーク | Next.js 15.4.11（App Router）＋ React 19 |
| 言語 | TypeScript |
| スタイル | Tailwind CSS 3 |
| フォント | EB Garamond ＋ Noto Serif / Sans JP（`next/font`） |
| CMS / 管理画面 | Payload CMS 3（Next.js に同梱・`/admin`） |
| データベース | PostgreSQL 18（開発: ローカル / 本番: Neon シンガポール） |
| 決済 | Stripe Checkout ＋ Webhook |
| 画像 | `next/image` ＋ sharp（本番は Vercel Blob / VPS ディスク） |
| ホスティング | Vercel（将来的に VPS へ移行予定） |

> **バージョン固定について**
> `next` は `15.4.11` を**完全固定**しています。`@payloadcms/next` の peer 範囲が
> 15.5.x を除外しており、キャレット（`^`）にすると install が失敗します。
> `sharp` も `0.34.x` に固定（`0.35.x` と二重読み込みになると libvips が衝突し、
> 画像最適化が無言で無効化されます）。

---

## セットアップ

### 1. 依存パッケージ

```bash
npm install
```

### 2. 環境変数

`.env.example` を `.env.local` にコピーして値を設定します。

| 変数 | 用途 |
|------|------|
| `PAYLOAD_SECRET` | Payload のトークン署名鍵。32 文字以上のランダム値（`openssl rand -hex 32`） |
| `NEXT_PUBLIC_SERVER_URL` | 公開 URL。開発は `http://localhost:3000` |
| `DATABASE_URI` | アプリが使う PostgreSQL。開発はローカル |
| `REMOTE_DATABASE_URI` | `npm run db:sync` のコピー元（本番 DB）。開発時のみ使用 |
| `STRIPE_SECRET_KEY` | Stripe のシークレットキー（未設定でもビルドは通る／決済は無効） |
| `STRIPE_WEBHOOK_SECRET` | Webhook 署名検証用 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe の公開キー |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob。**空ならローカルディスク保存**（開発用） |

### 3. ローカル DB の初期化（初回のみ）

[PostgreSQL 18 の Windows バイナリ](https://get.enterprisedb.com/postgresql/postgresql-18.1-1-windows-x64-binaries.zip)
を `D:\pgsql18` に解凍（`D:\pgsql18\pgsql\bin\...` になるように）したうえで:

```bash
npm run db:setup
```

### 4. 開発サーバー

```bash
npm run db:start   # ローカル PostgreSQL（約 1 秒）
npm run dev        # → http://localhost:3000
```

初回は `http://localhost:3000/admin` を開くとテーブルが自動生成されます。
その後 `npm run db:sync` で本番データを取り込めます。

詳細は **[document/本地开发环境.md](document/本地开发环境.md)** を参照してください。

---

## スクリプト一覧

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` / `npm start` | 本番ビルド／本番起動 |
| `npm run db:start` / `db:stop` / `db:status` | ローカル PostgreSQL の起動・停止・状態確認 |
| `npm run db:sync` | 本番 DB → ローカルへデータコピー（`-- --wipe` で事前クリア） |
| `npm run db:reset` | ローカル DB を作り直す |
| `npm run db:psql` | SQL 対話シェル |
| `npm run generate:types` | Payload のコレクション定義から型を生成 |
| `npm run generate:importmap` | 管理画面カスタムコンポーネントの import map 再生成 |

---

## ディレクトリ構成

```
src/
├── app/
│   ├── (frontend)/            # 公開サイト（独立したルートレイアウト）
│   │   ├── layout.tsx         #   フォント・共通メタデータ
│   │   ├── globals.css        #   Tailwind ＋ 共通スタイル
│   │   ├── page.tsx           #   トップページ
│   │   ├── shop/              #   商品一覧・商品詳細 /shop/[slug]
│   │   ├── blog/ journal/     #   ブログ一覧・記事
│   │   ├── sell/ consignment/ #   買取・委託
│   │   └── about/ stores/ …   #   その他の静的ページ
│   ├── (payload)/             # Payload 管理画面 /admin ＋ REST/GraphQL API
│   └── api/
│       ├── checkout/          #   Stripe Checkout セッション作成
│       ├── stripe/webhook/    #   決済完了 Webhook（署名検証あり）
│       ├── sell/              #   買取査定フォーム受付
│       └── media/file/        #   ローカル保存画像の配信
├── collections/               # ★Payload のデータ定義（＝管理画面の項目）
│   ├── Products.ts  Posts.ts  Orders.ts
│   ├── SellRequests.ts  Media.ts  Users.ts
├── components/                # UI コンポーネント
│   └── admin/                 #   管理画面のカスタムセル
├── lib/
│   ├── site.ts                # ★ブランド名・連絡先・ナビ
│   ├── cms.ts                 # Payload からの取得＋キャッシュ層
│   ├── data.ts                # DB 未接続時のフォールバックデータ
│   └── stripe.ts              # Stripe クライアント（遅延初期化）
└── payload.config.ts          # Payload 本体の設定

scripts/
├── pg.mjs                     # ローカル PostgreSQL の起動・停止
└── sync-db.mjs                # 本番 → ローカルのデータコピー

document/                      # 設計・運用ドキュメント
```

---

## カスタマイズの入口

| やりたいこと | 編集する場所 |
|---|---|
| 商品・ブログの追加や編集 | **`/admin`（コード不要）** |
| ブランド名・連絡先・ナビ | [`src/lib/site.ts`](src/lib/site.ts) |
| 配色・フォント | [`tailwind.config.ts`](tailwind.config.ts) |
| 共通スタイル（見出し・ボタン・価格） | [`src/app/(frontend)/globals.css`](src/app/(frontend)/globals.css) |
| 商品に項目を追加（型番・サイズ等） | [`src/collections/Products.ts`](src/collections/Products.ts) |
| DB 未接続時に出るデモデータ | [`src/lib/data.ts`](src/lib/data.ts) |

**コレクションに項目を足したとき**:
開発中は Payload の dev push モードが有効なので、`npm run dev` を再起動すれば
テーブル定義が自動で追従します。マイグレーションファイルは不要です。
本番（VPS）へ移行する際は `npx payload migrate:create` で正式な移行ファイルを作ります。

---

## データ取得とキャッシュ

[`src/lib/cms.ts`](src/lib/cms.ts) が Payload へのアクセスを一元化しています。

- 一覧・詳細の取得は `unstable_cache` でラップ（`revalidate: 300`、タグ `products` / `posts`）
- 管理画面で保存・削除すると、各コレクションの `afterChange` / `afterDelete` フックが
  `revalidateTag()` を呼ぶため、**キャッシュは即座に無効化**されます
- 注文の取得（`getOrderById`）は意図的にキャッシュしていません（状態が常に最新である必要があるため）

DB に接続できない／データが空の場合は `src/lib/data.ts` のデモデータに自動フォールバックします。

---

## デプロイ

### VPS（メイン）

単一 VPS 上で **Node（Next.js + Payload）/ PostgreSQL 18 / Caddy** の 3 プロセス構成。
HTTPS 証明書は Caddy が自動取得・自動更新します。

```bash
# 初回のみ
bash /srv/brandadagio/app/deploy/setup-server.sh

# 以降のデプロイ
bash /srv/brandadagio/app/deploy/deploy.sh
```

手順の全文は **[document/VPS部署手册.md](document/VPS部署手册.md)**。
設定ファイル一式は [`deploy/`](deploy) にあります。

| ファイル | 役割 |
|---|---|
| `deploy/setup-server.sh` | サーバー初期化（Node / PostgreSQL / Caddy / ufw） |
| `deploy/deploy.sh` | 取得 → ビルド → マイグレーション → 同期 → 再起動 |
| `deploy/brandadagio.service` | systemd ユニット |
| `deploy/Caddyfile` | リバースプロキシ・HTTPS・キャッシュ |
| `deploy/backup.sh` | 日次バックアップ（DB ＋ 画像） |

デプロイは `app/`（ビルド作業場）でビルドしてから `live/`（稼働中）へ同期する方式なので、
ビルドが失敗しても稼働中のサイトは無傷です。再起動の 1〜2 秒は Caddy の
`lb_try_duration` が吸収するため 502 になりません。

**本番で必要な環境変数**は `/etc/brandadagio.env`（root:600）に置きます。
`MEDIA_DIR` はリリースディレクトリの外（`/var/lib/brandadagio/media`）を指す必要があります。
ここを間違えるとデプロイのたびにアップロード画像が消えます。

### Vercel（移行前の環境）

```bash
./deploy.ps1
```

> `deploy.ps1` は一時ディレクトリへコピーしてから `vercel deploy --prod` を実行します。
> Vercel の「コミットの author メールと GitHub アカウントが一致しないとデプロイが
> ブロックされる」仕様を回避するためです（git 管理外から流し込む）。

Vercel 側では `DATABASE_URI` の末尾を `sslmode=verify-full` にし、
**Functions のリージョンを Singapore (sin1)** に合わせてください（DB と離れていると遅くなります）。

---

## ドキュメント

| ファイル | 内容 |
|---|---|
| [document/VPS部署手册.md](document/VPS部署手册.md) | **VPS へのデプロイ手順・運用・障害対応** |
| [document/本地开发环境.md](document/本地开发环境.md) | ローカル開発の手順・トラブルシュート |
| [document/落地方案-Next-Payload-Stripe.md](document/落地方案-Next-Payload-Stripe.md) | 構成の設計書 |
| [document/后台管理.md](document/后台管理.md) | 管理画面の方針 |
| [document/项目计划.md](document/项目计划.md) / [当前进度.md](document/当前进度.md) | 計画と進捗 |

---

## 注記

- 商品名・価格・画像の一部は **デモ用のプレースホルダー** です。実運用前に差し替えてください。
- `.env*` は `.gitignore` 対象です。秘密情報をコミットしないでください。
