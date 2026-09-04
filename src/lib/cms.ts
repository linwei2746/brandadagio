import { getPayload } from "payload";
import config from "@payload-config";
import {
  collection as mockProducts,
  featuredProducts as mockFeatured,
  journal as mockJournal,
  type Product as LegacyProduct,
} from "./data";

export type ProductItem = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  spec: string;
  category: "bag" | "jewelry" | "watch" | "accessory" | string;
  condition: "new" | "excellent" | "good" | "fair" | string;
  location: string;
  price: number;
  currency: "JPY" | "HKD";
  images: string[];
  image: string;
  badge?: string;
  status: "draft" | "available" | "reserved" | "sold";
  isFeatured?: boolean;
};

export type PostItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  content?: any;
  publishedAt: string;
  status: "draft" | "published";
};

export function extractImageUrl(media: any): string {
  if (!media) return "/img/1788083506887.png";
  if (typeof media === "string") {
    if (media.includes("/api/media/file/")) {
      const match = media.match(/\/api\/media\/file\/(.+)$/);
      if (match) return `/img/${match[1]}`;
    }
    if (media.startsWith("http") || media.startsWith("/")) return media;
    return `/img/${media}`;
  }
  if (typeof media === "object") {
    // 外部ストレージ (Vercel Blob / S3 / Unsplash 等) のURLを優先
    if (
      media.url &&
      !media.url.includes("/api/media/file/") &&
      (media.url.startsWith("http") || media.url.startsWith("/"))
    ) {
      return media.url;
    }
    // ローカル公開画像 (/public/img/) を直参照
    if (media.filename) {
      return `/img/${media.filename}`;
    }
    if (media.url) {
      const match = String(media.url).match(/\/api\/media\/file\/(.+)$/);
      if (match) return `/img/${match[1]}`;
      return media.url;
    }
  }
  return "/img/1788083506887.png";
}

function normalizeMockProduct(p: LegacyProduct, index = 0): ProductItem {
  return {
    id: p.id,
    slug: p.id,
    title: p.name,
    brand: "HERMÈS",
    spec: p.spec,
    category: "bag",
    condition: "excellent",
    location: p.location || "東京",
    price: p.price,
    currency: p.currency,
    images: [p.image],
    image: p.image,
    badge: p.badge,
    status: "available",
    isFeatured: true,
  };
}

function normalizePayloadProduct(doc: any): ProductItem {
  const images: string[] = [];
  if (Array.isArray(doc.images)) {
    for (const img of doc.images) {
      const url = extractImageUrl(img);
      if (url) images.push(url);
    }
  }
  const fallbackImg = images[0] || "/img/1788083506887.png";
  return {
    id: String(doc.id),
    slug: doc.slug ? String(doc.slug) : String(doc.id),
    title: doc.title || "Untitled Product",
    brand: doc.brand || "HERMÈS",
    spec: doc.spec || "",
    category: doc.category || "bag",
    condition: doc.condition || "excellent",
    location: doc.location || "東京",
    price: Number(doc.price) || 0,
    currency: doc.currency || "JPY",
    images: images.length > 0 ? images : [fallbackImg],
    image: fallbackImg,
    badge: doc.status === "sold" ? "売約済み" : doc.status === "reserved" ? "商談中" : doc.isFeatured ? "おすすめ" : undefined,
    status: doc.status || "available",
    isFeatured: Boolean(doc.isFeatured),
  };
}

function normalizePayloadPost(doc: any): PostItem {
  return {
    id: String(doc.id),
    slug: doc.slug ? String(doc.slug) : String(doc.id),
    title: doc.title || "Untitled Article",
    excerpt: doc.excerpt || "",
    coverImage: extractImageUrl(doc.coverImage),
    content: doc.content,
    publishedAt: doc.publishedAt ? String(doc.publishedAt).split("T")[0] : new Date().toISOString().split("T")[0],
    status: doc.status || "published",
  };
}

export async function getProducts(options?: {
  category?: string;
  condition?: string;
  location?: string;
  sort?: string;
  limit?: number;
  featuredOnly?: boolean;
}): Promise<ProductItem[]> {
  try {
    const payload = await getPayload({ config });
    const where: any = {
      status: { not_equals: "draft" },
    };
    if (options?.category && options.category !== "all") {
      where.category = { equals: options.category };
    }
    if (options?.condition && options.condition !== "all") {
      where.condition = { equals: options.condition };
    }
    if (options?.location && options.location !== "all") {
      where.location = { equals: options.location };
    }
    if (options?.featuredOnly) {
      where.isFeatured = { equals: true };
    }

    let sort = "-createdAt";
    if (options?.sort === "price_asc") sort = "price";
    if (options?.sort === "price_desc") sort = "-price";

    const { docs } = await payload.find({
      collection: "products",
      where,
      sort,
      limit: options?.limit || 50,
      depth: 1,
    });

    if (docs && docs.length > 0) {
      return docs.map(normalizePayloadProduct);
    }
  } catch (err) {
    console.warn("[cms] getProducts using mock fallback:", err);
  }

  // Fallback to mock products
  let list = (options?.featuredOnly ? mockFeatured : mockProducts).map((p, i) => normalizeMockProduct(p, i));

  if (options?.category && options.category !== "all") {
    list = list.filter((p) => p.category === options.category);
  }
  if (options?.condition && options.condition !== "all") {
    list = list.filter((p) => p.condition === options.condition);
  }
  if (options?.location && options.location !== "all") {
    list = list.filter((p) => p.location.includes(options.location!));
  }
  if (options?.sort === "price_asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (options?.sort === "price_desc") {
    list.sort((a, b) => b.price - a.price);
  }
  if (options?.limit) {
    list = list.slice(0, options.limit);
  }
  return list;
}

export async function getProductBySlugOrId(slugOrId: string): Promise<ProductItem | null> {
  try {
    const payload = await getPayload({ config });
    // First try by slug
    const bySlug = await payload.find({
      collection: "products",
      where: { slug: { equals: slugOrId } },
      limit: 1,
      depth: 1,
    });
    if (bySlug.docs && bySlug.docs.length > 0) {
      return normalizePayloadProduct(bySlug.docs[0]);
    }

    // Try by ID
    try {
      const byId = await payload.findByID({
        collection: "products",
        id: slugOrId,
        depth: 1,
      });
      if (byId) return normalizePayloadProduct(byId);
    } catch {
      // ID search may fail if slugOrId is not a valid integer/uuid in postgres
    }
  } catch (err) {
    console.warn("[cms] getProductBySlugOrId using fallback:", err);
  }

  // Fallback to mock products
  const allMock = [...mockProducts, ...mockFeatured].map((p, i) => normalizeMockProduct(p, i));
  const found = allMock.find((p) => p.id === slugOrId || p.slug === slugOrId);
  return found || allMock[0] || null;
}

export async function getPosts(limit = 10): Promise<PostItem[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "posts",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit,
      depth: 1,
    });
    if (docs && docs.length > 0) {
      return docs.map(normalizePayloadPost);
    }
  } catch (err) {
    console.warn("[cms] getPosts using mock fallback:", err);
  }

  // Fallback to mock journal
  return mockJournal.map((j, i) => ({
    id: `post-${i + 1}`,
    slug: `post-${i + 1}`,
    title: j.title,
    excerpt: j.excerpt,
    coverImage: j.image,
    publishedAt: j.date,
    status: "published" as const,
  }));
}

export async function getPostBySlug(slugOrId: string): Promise<PostItem | null> {
  try {
    const payload = await getPayload({ config });
    // 先按 slug 查找
    const { docs } = await payload.find({
      collection: "posts",
      where: { slug: { equals: slugOrId } },
      limit: 1,
      depth: 1,
    });
    if (docs && docs[0]) {
      return normalizePayloadPost(docs[0]);
    }

    // 若无匹配再按 ID 查找
    try {
      const byId = await payload.findByID({
        collection: "posts",
        id: slugOrId,
        depth: 1,
      });
      if (byId) return normalizePayloadPost(byId);
    } catch {
      // ID 查找错误忽略
    }
  } catch (err) {
    console.warn("[cms] getPostBySlug using fallback:", err);
  }

  const allPosts = await getPosts(50);
  return allPosts.find((p) => p.slug === slugOrId || p.id === slugOrId) || allPosts[0] || null;
}

export async function getOrderById(orderId: string) {
  try {
    const payload = await getPayload({ config });
    const order = await payload.findByID({
      collection: "orders",
      id: orderId,
      depth: 1,
    });
    return order;
  } catch (err) {
    console.warn("[cms] getOrderById failed:", err);
    return null;
  }
}
