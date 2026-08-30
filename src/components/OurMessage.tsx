import Link from "next/link";
import Reveal from "./Reveal";

export default function OurMessage() {
  return (
    <section className="relative overflow-hidden bg-cream py-28 md:py-36">
      <span className="watermark left-1/2 top-8 -translate-x-1/2 text-[20vw] text-ink/[0.04] md:text-[13vw]">
        Story
      </span>

      <Reveal className="container-narrow relative text-center">
        <span className="label-en">Our Message</span>
        <h2 className="heading-jp mt-5">わたしたちの想い</h2>

        <div className="mx-auto mt-10 max-w-xl space-y-6 text-[13px] leading-[2.3] tracking-[0.02em] text-ink/70 md:text-sm">
          <p>
            ひとつのバッグには、選んだ日の高揚も、
            共に過ごした時間も、静かに刻まれています。
          </p>
          <p>
            わたしたちは、その価値を「値段」だけで測りません。
            専門鑑定士がフォルム・金具・刻印・レザーをていねいに見極め、
            お品にふさわしい評価と、次の物語をお届けします。
          </p>
          <p>
            大切に使われてきたエルメスを、また大切にしてくれる方へ。
            売る人にも、次に迎える人にも、心の通う取引を。
          </p>
        </div>

        <div className="mt-11">
          <Link href="/about" className="btn-view">
            View More
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
