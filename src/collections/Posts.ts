import type { CollectionConfig } from "payload";

// ジャーナル（ブログ）。後台で無コード投稿。
export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "記事", plural: "記事" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "publishedAt"],
  },
  access: {
    // 公開済みのみ一般公開。下書きはログイン時のみ。
    read: ({ req }) => {
      if (req.user) return true;
      return { status: { equals: "published" } };
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: "title", type: "text", required: true, label: "タイトル" },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "スラッグ (URL)",
      admin: { position: "sidebar" },
    },
    { name: "excerpt", type: "textarea", label: "抜粋（一覧に表示）" },
    { name: "coverImage", type: "upload", relationTo: "media", label: "カバー画像" },
    { name: "content", type: "richText", label: "本文" },
    {
      name: "status",
      type: "select",
      label: "公開状態",
      defaultValue: "draft",
      admin: { position: "sidebar" },
      options: [
        { label: "下書き", value: "draft" },
        { label: "公開", value: "published" },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      label: "公開日",
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } },
    },
  ],
};
