import Image from "next/image";
import Reveal from "./Reveal";

const credentials = [
  "古物商許可証 第000000000000号",
  "AACD（日本流通自主管理協会）加盟",
  "エルメス製品の鑑定歴 15年以上",
  "国際基準に基づく真贋判定・状態評価",
];

export default function Appraiser() {
  return (
    <section className="bg-sand py-24 md:py-32">
      <div className="container-luxe grid items-center gap-12 md:grid-cols-2 md:gap-20">
        {/* 画像 */}
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] shadow-[0_40px_80px_-50px_rgba(60,52,44,0.55)]">
            <Image
              src="/img/1788083497989.png"
              alt="鑑定士による検品"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        {/* テキスト */}
        <Reveal delay={120}>
          <span className="label-en">Expertise</span>
          <h2 className="heading-jp mt-5">確かな目で、価値を見極める。</h2>
          <div className="mt-8 space-y-5 text-[13px] leading-[2.2] tracking-[0.02em] text-ink/70 md:text-sm">
            <p>
              エルメスの価値は、ブランド名だけでは測れません。
              素材の質感、金具の作り、刻印の年式、そして一点ごとの状態——
              豊富な実物経験を積んだ鑑定士だけが見抜ける「本物の証」があります。
            </p>
            <p>
              わたしたちは、その一つひとつをていねいに確かめ、
              お客様が安心して手放し、また安心して迎えられる取引をお約束します。
            </p>
          </div>

          <ul className="mt-9 space-y-3 border-t border-line pt-8">
            {credentials.map((c) => (
              <li
                key={c}
                className="flex items-start gap-3 text-[13px] tracking-[0.02em] text-ink/80"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
