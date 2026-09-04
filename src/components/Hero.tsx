import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-cream">
      {/* 全面の背景画像 */}
      <Image
        src="/img/1788083488929.png"
        alt="エルメス ケリー オレンジ"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* 左からのやわらかな白のスクリム（文字の可読性） */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-transparent" />

      {/* 大きく薄いウォーターマーク */}
      <span className="watermark left-[3%] top-[18%] text-[20vw] leading-none md:text-[15vw]">
        Héritage
      </span>


      {/* カルーセルのドット（装飾） */}
      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
      </div>
    </section>
  );
}
