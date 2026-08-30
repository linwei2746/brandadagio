import Link from "next/link";
import Reveal from "./Reveal";

const perks = [
  { title: "優先アクセス", body: "新入荷や希少なお品を一般公開前にご案内。" },
  { title: "VIPコンシェルジュ", body: "専任スタッフによるきめ細やかなサポート。" },
  { title: "グローバルネットワーク", body: "世界各国の希少なお品へのアクセス。" },
  { title: "パーソナルショッピング", body: "ご希望のお品を専任スタッフがお探しします。" },
];

export default function Membership() {
  return (
    <section className="relative overflow-hidden bg-cream py-24 text-ink md:py-32">
      {/* 装飾 */}
      <div className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-gold/10 opacity-70 blur-2xl" />

      <div className="container-luxe relative grid grid-cols-1 gap-16 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-gold">INVITATION ONLY</p>
          <h2 className="mt-4 font-serif text-3xl font-light leading-tight md:text-[2.6rem]">
brandadagio メンバーシップ
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/75">
            特別なアクセスと限定特典をご用意した、招待制のメンバーシップ。
            会員登録で、限定の特典やサービスをお楽しみいただけます。
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/membership" className="btn-gold justify-center">
              入会を申し込む
            </Link>
            <Link
              href="/membership"
              className="inline-flex items-center justify-center gap-2 border border-ink/30 px-8 py-3 text-[13px] tracking-[0.18em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
            >
              詳しく見る
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-px self-center bg-ink/10 sm:grid-cols-2">
          {perks.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="h-full bg-ivory p-8">
                <h3 className="font-serif text-lg text-gold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
