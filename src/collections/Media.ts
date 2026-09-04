import type { CollectionConfig } from "payload";

// 画像・ファイル。アップロード即利用。保存先は payload.config の storage 設定に従う
// （本番は Vercel Blob / S3・R2、ローカルは disk）。
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "メディア", plural: "メディア" },
  access: {
    read: () => true, // 公開画像
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  upload: {
    // レスポンシブ用の派生サイズ
    imageSizes: [
      { name: "thumb", width: 480, height: 600, position: "centre" },
      { name: "card", width: 800, height: 1000, position: "centre" },
      { name: "hero", width: 2000, height: undefined },
    ],
    mimeTypes: ["image/*"],
  },
  fields: [{ name: "alt", type: "text", label: "代替テキスト" }],
};
