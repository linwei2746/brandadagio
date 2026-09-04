import type { CollectionConfig } from "payload";

// 買取 / 委託の査定申込。前台フォームから作成、鑑定士が後台で査定。
export const SellRequests: CollectionConfig = {
  slug: "sell-requests",
  labels: { singular: "買取申込", plural: "買取申込" },
  admin: {
    useAsTitle: "itemName",
    defaultColumns: ["itemName", "name", "type", "status", "createdAt"],
  },
  access: {
    read: ({ req }) => !!req.user, // 管理はスタッフのみ
    create: () => true, // 誰でも申込可（未ログインの見込み客含む）
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: "type",
      type: "select",
      label: "種別",
      defaultValue: "buyback",
      options: [
        { label: "買取", value: "buyback" },
        { label: "委託販売", value: "consignment" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, label: "お名前" },
        { name: "email", type: "email", required: true, label: "メール" },
        { name: "phone", type: "text", label: "電話" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "brand", type: "text", label: "ブランド", defaultValue: "HERMÈS" },
        { name: "itemName", type: "text", label: "品名" },
        { name: "condition", type: "text", label: "状態" },
      ],
    },
    { name: "note", type: "textarea", label: "備考" },
    { name: "images", type: "upload", relationTo: "media", hasMany: true, label: "画像" },
    {
      name: "status",
      type: "select",
      label: "進行状態",
      defaultValue: "uploaded",
      admin: { position: "sidebar" },
      options: [
        { label: "申込受付", value: "uploaded" },
        { label: "査定中", value: "pending_appraisal" },
        { label: "査定済み", value: "appraised" },
        { label: "成約", value: "accepted" },
        { label: "発送済み", value: "shipped" },
        { label: "完了", value: "completed" },
        { label: "見送り", value: "declined" },
      ],
    },
    {
      name: "appraisedPrice",
      type: "number",
      label: "査定価格",
      admin: { position: "sidebar" },
    },
  ],
};
