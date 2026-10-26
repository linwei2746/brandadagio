import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { ja } from "@payloadcms/translations/languages/ja";
import { en } from "@payloadcms/translations/languages/en";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Products } from "./collections/Products";
import { Posts } from "./collections/Posts";
import { Orders } from "./collections/Orders";
import { SellRequests } from "./collections/SellRequests";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// 本番（Vercel）は Blob、未設定のローカルはディスク保存にフォールバック
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  admin: {
    user: Users.slug,
    meta: { titleSuffix: "・ brandadagio 管理" },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Products, Posts, Orders, SellRequests, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
    // 開発中はコレクション定義を保存するだけでテーブルへ即反映（push）。
    // 本番では必ずマイグレーション経由にする（意図しない DROP を防ぐため）。
    push: process.env.NODE_ENV !== "production",
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  // 管理画面を日本語表示に
  i18n: {
    supportedLanguages: { ja, en },
    fallbackLanguage: "ja",
  },
  plugins: blobToken
    ? [
        vercelBlobStorage({
          collections: { media: true },
          token: blobToken,
        }),
      ]
    : [],
});
