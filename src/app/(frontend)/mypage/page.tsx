import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function MyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-32 pb-32">
        <div className="container-luxe max-w-xl text-center">
          <span className="label-en block text-gold">ACCOUNT & ADMIN</span>
          <h1 className="heading-jp mt-3">マイページ</h1>
          <p className="mt-4 text-xs leading-relaxed text-ink/70 md:text-sm">
            管理スタッフの方は管理画面（Payload Admin）へログインして商品管理・査定処理を行ってください。
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/admin" className="btn-gold justify-center">
              管理画面（/admin）へログイン
            </Link>
            <Link href="/membership" className="btn-outline justify-center">
              メンバーシップのご案内
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
