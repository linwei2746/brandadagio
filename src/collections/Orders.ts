import type { CollectionConfig } from "payload";

// 注文。Stripe Checkout 経由で作成・更新（Webhook で paid に）。
export const Orders: CollectionConfig = {
  slug: "orders",
  labels: { singular: "注文", plural: "注文" },
  admin: {
    useAsTitle: "orderNo",
    defaultColumns: ["orderNo", "total", "status", "createdAt"],
  },
  access: {
    // 管理はログインユーザーのみ。作成はサーバー側（checkout API）から行う。
    read: ({ req }) => !!req.user,
    create: () => true, // API ルートから作成（サーバー実行）
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === "create" && !data.orderNo) {
          data.orderNo = `BA-${Date.now().toString(36).toUpperCase()}`;
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "orderNo", type: "text", label: "注文番号", admin: { readOnly: true } },
    {
      name: "items",
      type: "array",
      label: "商品",
      fields: [
        { name: "product", type: "relationship", relationTo: "products" },
        { name: "title", type: "text" },
        { name: "price", type: "number" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "total", type: "number", label: "合計" },
        { name: "currency", type: "text", label: "通貨", defaultValue: "JPY" },
      ],
    },
    {
      name: "customer",
      type: "group",
      label: "購入者",
      fields: [
        { name: "name", type: "text", label: "氏名" },
        { name: "email", type: "email", label: "メール" },
        { name: "phone", type: "text", label: "電話" },
      ],
    },
    {
      name: "status",
      type: "select",
      label: "状態",
      defaultValue: "pending",
      options: [
        { label: "支払い待ち", value: "pending" },
        { label: "支払い済み", value: "paid" },
        { label: "発送済み", value: "shipped" },
        { label: "完了", value: "completed" },
        { label: "キャンセル", value: "cancelled" },
      ],
    },
    { name: "stripeSessionId", type: "text", label: "Stripe Session", admin: { readOnly: true } },
    { name: "paidAt", type: "date", label: "支払日時", admin: { readOnly: true } },
  ],
};
