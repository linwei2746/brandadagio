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
  const hasMultiple = images.length > 1;

  const move = (step: number) => {
    setSelectedIndex((i) => (i + step + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* メイン画像 */}
      <div className="group relative aspect-square w-full overflow-hidden border border-line bg-ivory">
        <Image
          src={activeImage}
          alt={`${title} - 画像 ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="前の画像"
              onClick={() => move(-1)}
              className="absolute left-0 top-1/2 flex h-11 w-9 -translate-y-1/2 items-center justify-center bg-ink/35 text-lg text-ivory opacity-0 transition-opacity group-hover:opacity-100"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="次の画像"
              onClick={() => move(1)}
              className="absolute right-0 top-1/2 flex h-11 w-9 -translate-y-1/2 items-center justify-center bg-ink/35 text-lg text-ivory opacity-0 transition-opacity group-hover:opacity-100"
            >
              ›
            </button>
            <span className="absolute bottom-0 right-0 bg-ink/50 px-2 py-[3px] text-[11px] leading-none text-ivory">
              {selectedIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* サムネイル */}
      {hasMultiple && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`画像 ${index + 1} を表示`}
                className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden border transition-colors ${
                  isSelected ? "border-ink" : "border-line hover:border-stone"
                }`}
              >
                <Image
                  src={img}
                  alt={`サムネイル ${index + 1}`}
                  fill
                  sizes="72px"
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
