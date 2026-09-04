import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

// 買取 / 委託の査定申込を受け付け、sell-requests に保存
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let name = "";
    let email = "";
    let phone = "";
    let brand = "HERMÈS";
    let itemName = "";
    let condition = "";
    let note = "";
    let type = "buyback";
    let mediaIds: (number | string)[] = [];

    const payload = await getPayload({ config });

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = (formData.get("name") as string) || "";
      email = (formData.get("email") as string) || "";
      phone = (formData.get("phone") as string) || "";
      brand = (formData.get("brand") as string) || "HERMÈS";
      itemName = (formData.get("itemName") as string) || "";
      condition = (formData.get("condition") as string) || "";
      note = (formData.get("note") as string) || "";
      type = (formData.get("type") as string) || "buyback";

      const files = formData.getAll("images");
      for (const item of files) {
        if (item instanceof File && item.size > 0) {
          try {
            const buffer = Buffer.from(await item.arrayBuffer());
            const media = await payload.create({
              collection: "media",
              data: {
                alt: `${itemName || "査定品"} - ${name}`,
              },
              file: {
                data: buffer,
                mimetype: item.type || "image/jpeg",
                name: item.name || `appraisal-${Date.now()}.jpg`,
                size: buffer.length,
              },
            });
            mediaIds.push(media.id);
          } catch (uploadErr) {
            console.warn("[sell] media upload error:", uploadErr);
          }
        }
      }
    } else {
      const data = await req.json();
      name = data.name || "";
      email = data.email || "";
      phone = data.phone || "";
      brand = data.brand || "HERMÈS";
      itemName = data.itemName || "";
      condition = data.condition || "";
      note = data.note || "";
      type = data.type || "buyback";
      if (Array.isArray(data.images)) {
        mediaIds = data.images;
      }
    }

    if (!name || !email) {
      return NextResponse.json({ error: "お名前とメールアドレスは必須です" }, { status: 400 });
    }

    const created = await payload.create({
      collection: "sell-requests",
      data: {
        type: type === "consignment" ? "consignment" : "buyback",
        name,
        email,
        phone,
        brand,
        itemName,
        condition,
        note,
        images: mediaIds.length > 0 ? mediaIds : undefined,
        status: "uploaded",
      },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error("[sell]", err);
    return NextResponse.json({ error: "申込の送信に失敗しました" }, { status: 500 });
  }
}
