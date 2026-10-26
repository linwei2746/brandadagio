import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

// 商品（在庫）。後台で無コード管理。
export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "商品", plural: "商品" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["images", "title", "price", "stock", "status", "isFeatured"],
  },
  hooks: {
    // 管理画面で保存・削除したら一覧/詳細のキャッシュを即時失効
    afterChange: [
      () => {
        try {
          revalidateTag("products");
        } catch {
          /* リクエスト外からの呼び出しは無視 */
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidateTag("products");
        } catch {
          /* 同上 */
        }
      },
    ],
    beforeValidate: [
      ({ data }) => {
        if (data) {
          // 在庫数と公開状態（status）の自動連動
          if (data.stock === 0 && data.status === "available") {
            data.status = "sold";
          } else if (data.status === "sold" && (data.stock === undefined || data.stock > 0)) {
            data.stock = 0;
          }
        }
        return data;
      },
    ],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: "title", type: "text", required: true, label: "商品名" },
    { name: "slug", type: "text", label: "スラッグ (URL)", admin: { position: "sidebar" } },
    { name: "brand", type: "text", label: "ブランド", defaultValue: "HERMÈS" },
    { name: "spec", type: "text", label: "素材・金具" },
    {
      name: "category",
      type: "select",
      label: "カテゴリ",
      defaultValue: "bag",
      options: [
        { label: "バッグ", value: "bag" },
        { label: "ジュエリー", value: "jewelry" },
        { label: "時計", value: "watch" },
        { label: "小物", value: "accessory" },
      ],
    },
    {
      name: "condition",
      type: "select",
      label: "状態（コンディション）",
      defaultValue: "excellent",
      options: [
        { label: "新品", value: "new" },
        { label: "極美品", value: "excellent" },
        { label: "美品", value: "good" },
        { label: "良品", value: "fair" },
      ],
    },
    { name: "location", type: "text", label: "在庫拠点", defaultValue: "東京" },
    {
      type: "row",
      fields: [
        { name: "price", type: "number", required: true, label: "価格", min: 0 },
        {
          name: "currency",
          type: "select",
          label: "通貨",
          defaultValue: "JPY",
          options: ["JPY", "HKD"],
        },
        {
          name: "stock",
          type: "number",
          label: "在庫数",
          defaultValue: 1,
          min: 0,
          admin: {
            step: 1,
            description: "数量（0で売約済み）",
          },
        },
      ],
    },
    {
      name: "images",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      label: "画像",
      admin: {
        components: {
          Cell: "@/components/admin/ProductThumbnailCell#ProductThumbnailCell",
        },
      },
    },
    {
      name: "status",
      type: "select",
      label: "公開状態",
      defaultValue: "draft",
      admin: { position: "sidebar" },
      options: [
        { label: "下書き（非公開）", value: "draft" },
        { label: "販売中", value: "available" },
        { label: "予約済み", value: "reserved" },
        { label: "売約済み", value: "sold" },
      ],
    },
    {
      name: "isFeatured",
      type: "checkbox",
      label: "おすすめに表示",
      admin: { position: "sidebar" },
    },
    // Stripe 連携（任意）：事前に Price を作る場合に使用。未設定なら都度 price_data で作成。
    {
      name: "stripePriceId",
      type: "text",
      label: "Stripe Price ID（任意）",
      admin: { position: "sidebar" },
    },
  ],
};
