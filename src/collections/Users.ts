import type { CollectionConfig } from "payload";

// 後台アカウント（鑑定士・運営）。Payload 内蔵の認証を利用。
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  labels: { singular: "スタッフ", plural: "スタッフ" },
  admin: { useAsTitle: "email", defaultColumns: ["email", "name", "role"] },
  access: {
    // ログイン済みのみ管理可能
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: "name", type: "text", label: "氏名" },
    {
      name: "role",
      type: "select",
      label: "権限",
      defaultValue: "staff",
      options: [
        { label: "管理者", value: "admin" },
        { label: "スタッフ / 鑑定士", value: "staff" },
      ],
    },
  ],
};
