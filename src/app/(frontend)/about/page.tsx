import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-28 pb-28 md:pt-36">
        <div className="container-luxe max-w-4xl">
          <div className="text-center">
            <span className="label-en">Our Philosophy</span>
            <h1 className="heading-jp mt-4">私たちについて</h1>
            <p className="mt-4 text-xs tracking-wider text-ink/60 md:text-sm">
              所有を超えたラグジュアリーの価値を、真摯に次代へ継承する。
            </p>
          </div>

          <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-[2px] bg-line shadow-sm">
            <Image
              src="/img/1788083506887.png"
              alt="brandadagio salon"
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-12 space-y-8 text-xs leading-relaxed text-ink/80 md:text-sm">
            <h2 className="font-mincho text-xl text-ink md:text-2xl">
              確かな鑑定力と、世界を結ぶネットワーク
            </h2>
            <p>
              brandadagio（ブランド・アダージョ）は、エルメスをはじめとする最高峰ラグジュアリーアイテムの販売・買取・委託販売を手がけるラグジュアリー・アセット・プラットフォームです。
            </p>
            <p>
              私たちは、単なる中古ブランド品の流通にとどまらず、数十年の経験を有する専門鑑定士による厳格な真贋保証と、東京・大阪・香港・シンガポール・ドバイ・パリの国際ネットワークを通じて、一つひとつのお品が持つ真の価値を世界市場において最大化することを目指しています。
            </p>
            <p>
              大切に受け継がれてきたタイムレスな名品を、次のコレクターへと確実に繋ぐ架け橋として、確かな安心と最高峰のおもてなしをご提供いたします。
            </p>
          </div>

          <div className="mt-16 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/shop" className="btn-gold">
              コレクションを見る
            </Link>
            <Link href="/sell" className="btn-outline">
              無料査定を申し込む
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
