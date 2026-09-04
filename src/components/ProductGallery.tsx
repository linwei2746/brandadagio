"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex] || images[0] || "/img/1788083506887.png";

  return (
    <div className="flex flex-col gap-4">
      {/* 主图 */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-ivory shadow-sm">
        <Image
          src={activeImage}
          alt={`${title} - 画像 ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* 缩略图列表 */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-[2px] border transition-all ${
                  isSelected ? "border-gold ring-1 ring-gold" : "border-line opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`サムネイル ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
