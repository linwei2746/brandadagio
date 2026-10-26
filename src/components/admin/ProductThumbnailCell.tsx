import React from "react";
import type { DefaultServerCellComponentProps } from "payload";

export const ProductThumbnailCell = async ({
  cellData,
  rowData,
  payload,
}: DefaultServerCellComponentProps) => {
  const rawList = Array.isArray(cellData)
    ? cellData
    : Array.isArray((rowData as any)?.images)
    ? (rowData as any).images
    : cellData
    ? [cellData]
    : [];

  let first = rawList[0];
  let src = "";

  // 如果仅有关联 ID，则通过 Payload 服务端实例查询媒体详情
  if (typeof first === "number" || (typeof first === "string" && /^\d+$/.test(first))) {
    try {
      const mediaDoc: any = await payload.findByID({
        collection: "media",
        id: String(first),
        depth: 0,
      });
      if (mediaDoc) first = mediaDoc;
    } catch {
      // 忽略查询失败
    }
  }

  if (typeof first === "string") {
    if (first.includes("/api/media/file/")) {
      const m = first.match(/\/api\/media\/file\/(.+)$/);
      src = m ? `/img/${m[1]}` : first;
    } else if (first.startsWith("http") || first.startsWith("/")) {
      src = first;
    } else {
      src = `/img/${first}`;
    }
  } else if (typeof first === "object" && first !== null) {
    if (first.url && !first.url.includes("/api/media/file/")) {
      src = first.url;
    } else if (first.filename) {
      src = `/img/${first.filename}`;
    } else if (first.url) {
      const m = String(first.url).match(/\/api\/media\/file\/(.+)$/);
      src = m ? `/img/${m[1]}` : first.url;
    }
  }

  return (
    <div
      style={{
        width: "46px",
        height: "46px",
        borderRadius: "4px",
        overflow: "hidden",
        backgroundColor: "#f5f5f4",
        border: "1px solid #e7e5e4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <span style={{ fontSize: "10px", color: "#a8a29e" }}>No img</span>
      )}
    </div>
  );
};
