# 落地方案 — Next.js ＋ Payload CMS ＋ Stripe（全自托管）

> 面向 brandadagio（エルメス 买取・販売・委托）的正式技术落地方案。
> 满足两条硬约束：
> 1. **商品更新与博客发布必须无代码**（改版式可接受代码开发）
> 2. **除服务器 / 数据库 / 域名 / 支付手续费外，不产生任何其他固定费用**

---

## 1. 方案总览

| 层 | 采用 | 无代码? | 费用性质 |
|----|------|--------|----------|
| 前端 | **Next.js 14（现有 DEAREST 设计，复用）** | 改版式需代码 | 含在服务器内 |
| 无代码后台 / CMS | **Payload CMS 3（开源·自托管·MIT）** | ✅ 商品·博客·订单·买取全后台操作 | **免费** |
| 数据库 | **PostgreSQL**（Supabase/Neon 免费档或自建） | — | 允许（数据库） |
| 支付 | **Stripe**（Checkout 托管收银台） | — | 允许（仅按笔手续费，无月费） |
| 图片/文件 | **本地磁盘**（存 VPS）或可选 S3 兼容 | 后台上传 | 存磁盘＝免费 |
| 邮件通知 | Resend 免费档 / 自建 SMTP | — | 可做到 0 固定费 |
| 部署 | **自托管 VPS**（Docker 或 PM2 + Nginx） | — | 允许（服务器） |

**核心特征**：前端 + Payload 后台 + 结账 API 是**同一个 Next.js 项目、同一次部署、同一个数据库**。Payload 3 原生嵌入 Next.js App Router，后台位于 `/admin`。

---

## 2. 架构

```
                          ┌──────────── 访客 / 客户后台 ────────────┐
                          │                                          │
                    浏览器（前台）                          浏览器（/admin 后台）
                          │                                          │
┌─────────────────────────┼──────────────────────────────────────────┼───────────┐
│   1 台 VPS（自托管）      ▼                                          ▼           │
│   ┌───────────────── Next.js + Payload（同一进程）─────────────────────────┐   │
│   │  前台（App Router）           Payload Admin(/admin)     API 路由        │   │
│   │  ├─ /            ホーム        ├─ 商品 Products          ├─ /api/checkout │   │
│   │  ├─ /shop /shop/[id]           ├─ 記事 Posts             ├─ /api/stripe/  │   │
│   │  ├─ /journal /journal/[slug]   ├─ 注文 Orders            │    webhook      │   │
│   │  ├─ /sell（买取申请）          ├─ 買取 SellRequests      └─ /api/sell     │   │
│   │  └─ …                          └─ Media / Users                          │   │
│   └───────────────────────────────┬───────────────────────────────────────┘   │
│                                    │                                            │
│   Nginx（反向代理 + HTTPS）        │  画像 → ローカルディスク（/media）        │
└────────────────────────────────────┼───────────────────────────────────────────┘
                                     │
                    ┌────────────────┼─────────────────┐
                    ▼                                    ▼
              PostgreSQL                             Stripe
          （商品/記事/注文/買取）              （Checkout・Webhook・手数料のみ）
```

---

## 3. 数据模型（Payload Collections）

Payload 里每个 **Collection** ＝ 一张表 ＝ 后台一个管理入口。客户在后台对这些做无代码增删改。

| Collection | 用途 | 关键字段 |
|-----------|------|----------|
| `products` | 商品（在售库存） | title, brand, category, spec, condition, location, price, currency, images(→media), status(draft/available/reserved/sold), isFeatured, stripePriceId |
| `posts` | 博客文章 | title, slug, excerpt, coverImage, content(富文本), publishedAt, status |
| `orders` | 订单 | orderNo, items[], customer, total, currency, status(pending/paid/shipped/…), stripeSessionId, paidAt |
| `sellRequests` | 买取/回收申请 | name, email, phone, brand, itemName, condition, note, images, status(uploaded→appraised→accepted→completed), appraisedPrice |
| `media` | 图片/文件 | 上传即用，自动存磁盘并生成缩略图 |
| `users` | 后台账号（鉴定师/运营） | email, password, role(admin/staff) — Payload 内置认证 |

> 商品从 `draft` → `available` 即"上架"；前台只查询非 draft。

---

## 4. Payload 接入现有 Next.js 项目

Payload 3 直接装进当前项目，不新起服务。步骤：

### 4.1 安装

```bash
npm i payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical \
      @payloadcms/storage-s3 stripe
```

### 4.2 环境变量（追加到 `.env.local` / VPS 环境）

```bash
DATABASE_URI=postgres://user:pass@host:5432/dbname
PAYLOAD_SECRET=用一段足够长的随机串
NEXT_PUBLIC_SERVER_URL=https://brandadagio.example
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

### 4.3 `payload.config.ts`（项目根）

```ts
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { Products } from "./src/collections/Products";
import { Posts } from "./src/collections/Posts";
import { Orders } from "./src/collections/Orders";
import { SellRequests } from "./src/collections/SellRequests";
import { Media } from "./src/collections/Media";
import { Users } from "./src/collections/Users";

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  secret: process.env.PAYLOAD_SECRET!,
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } }),
  editor: lexicalEditor(),
  collections: [Products, Posts, Orders, SellRequests, Media, Users],
  // 后台界面语言可设为日语
  i18n: { supportedLanguages: { ja: {}, en: {} } },
  typescript: { outputFile: "./src/payload-types.ts" },
});
```

### 4.4 一个 Collection 示例：`src/collections/Products.ts`

```ts
import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "商品", plural: "商品" },
  admin: { useAsTitle: "title", defaultColumns: ["title", "price", "status"] },
  access: {
    read: () => true,              // 前台可读
    create: ({ req }) => !!req.user, // 后台登录用户可增改删
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: "title", type: "text", required: true, label: "商品名" },
    { name: "brand", type: "text", label: "ブランド", defaultValue: "HERMÈS" },
    { name: "spec", type: "text", label: "素材・金具" },
    { name: "price", type: "number", required: true, label: "価格" },
    { name: "currency", type: "select", defaultValue: "JPY",
      options: ["JPY", "HKD"] },
    { name: "condition", type: "select", label: "状態",
      options: ["new", "excellent", "good", "fair"], defaultValue: "excellent" },
    { name: "location", type: "text", label: "在庫拠点", defaultValue: "東京" },
    { name: "images", type: "upload", relationTo: "media", hasMany: true, label: "画像" },
    { name: "status", type: "select", label: "状態",
      options: ["draft", "available", "reserved", "sold"], defaultValue: "draft" },
    { name: "isFeatured", type: "checkbox", label: "おすすめに表示" },
  ],
};
```

> `posts` / `orders` / `sellRequests` 同理，字段见第 3 节。富文本正文用 `type: "richText"`。

### 4.5 挂载后台路由

按 Payload 文档在 `src/app/(payload)/` 下放入其提供的 `admin` 路由与 `api` 处理器（`npx payload generate` 会生成骨架），并在 `next.config.mjs` 用 `withPayload()` 包裹。完成后：
- 后台：`https://站点/admin`
- Payload REST/GraphQL：`/api/...`（前台取数据用）

---

## 5. 客户视角：无代码日常操作

- **上架商品**：登录 `/admin` → 「商品」→「新規作成」→ 填名称/价格/状态，拖拽上传图片 → 选 `available` 保存 → 前台 `/shop` 立即出现。
- **发博客**：`/admin` →「記事」→ 写标题与富文本正文、上传封面 → `publishedAt` 设为发布日 → 保存 → 前台 `/journal` 出现。
- **处理买取申请**：`/admin` →「買取」→ 打开客户提交的申请 → 填鉴定价、改状态（appraised/accepted…）→ 保存（可触发邮件通知）。
- **看订单**：`/admin` →「注文」查看 paid 订单与买家信息。

全程零代码。**改版式 / 加板块** 才需要开发改 Next.js 代码。

---

## 6. Stripe 在线结账流程

采用 **Stripe Checkout（托管收银台）**：PCI 合规由 Stripe 承担，无月费、仅按笔手续费。

```
1. 前台商品页/购物车 → 点击「購入」
2. → 调用 /api/checkout：在服务端用商品信息创建 Stripe Checkout Session，
     同时在 orders 表插入一条 pending 订单
3. → 前端重定向到 Stripe 托管收银台，客户付款
4. Stripe → 回调 /api/stripe/webhook（验证签名）：
     ├─ 将对应 order 状态改为 paid、记录 paidAt
     ├─ 将商品 status 改为 sold（防重复售出）
     └─ 发送确认邮件
5. 客户被跳回 /checkout/success
```

### 6.1 创建结账会话 `src/app/api/checkout/route.ts`

```ts
import Stripe from "stripe";
import { getPayload } from "payload";
import config from "@/../payload.config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { productId } = await req.json();
  const payload = await getPayload({ config });

  const product = await payload.findByID({ collection: "products", id: productId });
  if (!product || product.status !== "available") {
    return Response.json({ error: "在庫がありません" }, { status: 409 });
  }

  // pending 订单
  const order = await payload.create({
    collection: "orders",
    data: { items: [{ product: product.id, price: product.price }],
            total: product.price, currency: product.currency, status: "pending" },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{
      quantity: 1,
      price_data: {
        currency: (product.currency as string).toLowerCase(),
        unit_amount: product.price, // JPY は最小単位＝円（×100 不要）
        product_data: { name: product.title },
      },
    }],
    // 日本の各種決済や Alipay/WeChat を有効化する場合はここで payment_method_types を指定
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/success?o=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/${product.id}`,
    metadata: { orderId: String(order.id), productId: String(product.id) },
  });

  return Response.json({ url: session.url });
}
```

### 6.2 Webhook `src/app/api/stripe/webhook/route.ts`

```ts
import Stripe from "stripe";
import { getPayload } from "payload";
import config from "@/../payload.config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response("bad signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const payload = await getPayload({ config });
    await payload.update({ collection: "orders", id: s.metadata!.orderId,
      data: { status: "paid", stripeSessionId: s.id, paidAt: new Date().toISOString() } });
    await payload.update({ collection: "products", id: s.metadata!.productId,
      data: { status: "sold" } });
    // TODO: 送信メール（Resend 等）
  }
  return new Response("ok");
}
```

> **日本/中国の決済手段**：Stripe はカードのほか Alipay / WeChat Pay に対応。コンビニ払い・PayPay が必要なら **KOMOJU**（同じく月額なし・従量課金）を併用。いずれも固定費なし。

---

## 7. 买取 / 回收（回收）流程

1. 前台 `/sell` 表单：姓名・连络先・ブランド・品名・状态・图片上传 → `POST /api/sell` 写入 `sellRequests`（`uploaded`）。
2. 鉴定师在 `/admin`「買取」查看 → 填 `appraisedPrice`、改状态为 `appraised` → 保存触发报价邮件。
3. 客户同意 → 状态 `accepted` → 寄送 → 复检 → `completed` 付款。

全部在 Payload 后台无代码流转；表单与邮件属一次性开发。

---

## 8. 前端接数据（把 demo 数据换成 Payload）

现有前台用的是 `src/lib/data.ts` 的假数据。上线时改为查询 Payload（服务端组件，本地直查、无 HTTP 开销）：

```ts
import { getPayload } from "payload";
import config from "@/../payload.config";

export async function getProducts() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "products",
    where: { status: { not_equals: "draft" } },
    sort: "-createdAt",
    limit: 12,
  });
  return docs;
}
```

首页 `おすすめ` → `where: { isFeatured: { equals: true } }`。设计与组件**完全不变**，只替换数据来源。

---

## 9. 部署（自托管 VPS，零 SaaS 费）

**目标主机**：1 台小型 VPS（如 2 vCPU / 2–4GB）。示例用 Docker Compose：

```
VPS
├─ Nginx           反向代理 + Let's Encrypt HTTPS（免费证书）
├─ Next.js+Payload （Docker 容器，端口 3000）
├─ PostgreSQL      （容器或用 Supabase/Neon 免费档）
└─ /media          图片持久化目录（挂载卷）
```

要点：
- `next build` 产出后 `next start`；用 **PM2** 或 **Docker + restart:always** 保活。
- **备份**：每日 `pg_dump` + `/media` 目录打包，存异地（对象存储免费档或另一台机）。
- **邮件**：Resend 免费档（3,000 封/月）或 VPS 自建 Postfix → 0 固定费。
- CI/CD：GitHub Actions push 到 main → SSH 到 VPS 拉取 + 重建（可选）。

> 若想更省心也可把前端放 Vercel、DB 放 Supabase——但**商用需注意 Vercel 付费档**可能成为固定费；为严格满足"无其他固定费"，推荐**单 VPS 自托管**。

---

## 10. 安全与维护清单

- Payload 后台账号仅在 `/admin` 手动创建，开启强密码 / 2FA（插件）。
- Stripe 用 **live** 密钥仅存 VPS 环境变量，Webhook 校验签名（已含）。
- Nginx 限流 + 基础 WAF；定期 `npm audit` 与依赖更新。
- 数据库连接仅内网 / 白名单；每日自动备份并定期演练恢复。
- 图片上传限制类型与大小（Payload 可配）。

---

## 11. 里程碑与工时（估算）

| 阶段 | 内容 | 估算 |
|------|------|------|
| M1 接入 Payload | 安装、6 个 Collection、后台日文化、账号 | 2–3 天 |
| M2 前端接数据 | `/shop` `/shop/[id]` `/journal` `/journal/[slug]` 改为 Payload 查询、ISR | 2–3 天 |
| M3 结账 | 购物车/购入按钮、`/api/checkout`、Webhook、成功页、邮件 | 3–4 天 |
| M4 买取流程 | `/sell` 表单、上传、后台报价流转、通知 | 2 天 |
| M5 部署上线 | VPS + Nginx + HTTPS + 备份 + CI | 2 天 |
| **合计** | | **约 2–3 周** |

---

## 12. 备选（同为开源自托管·无月费）

- **Directus** 代替 Payload：架在同一个 Postgres 上，后台更接近"可视化数据表"，非技术客户也很好上手；前端仍复用现有 Next.js。选择依据：更偏"数据库直管"用 Directus，更偏"内容/富文本 + 与 Next 同仓库"用 Payload（本方案首选）。
- 结账若想要更完整电商引擎：**Medusa.js**（开源自托管）+ Directus/Payload（博客）——功能更全但两套系统，SKU 不多时不必要。

---

## 结论

**Next.js（现有设计）＋ Payload ＋ Stripe，全自托管**：
- ✅ 商品/博客**无代码**自助更新；改版式走开发
- ✅ 除服务器/数据库/域名/支付手续费外**无任何其他固定费用**
- ✅ **直接复用**我们已完成的 DEAREST 定制前端，设计与性能不丢
- ✅ 一套 TypeScript 代码库，安全面小、易维护、易交接
