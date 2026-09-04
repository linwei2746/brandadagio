"use client";

import { useState } from "react";
import Image from "next/image";

interface SellFormProps {
  defaultType?: "buyback" | "consignment";
}

export default function SellForm({ defaultType = "buyback" }: SellFormProps) {
  const [type, setType] = useState<"buyback" | "consignment">(defaultType);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [brand, setBrand] = useState("HERMÈS");
  const [itemName, setItemName] = useState("");
  const [condition, setCondition] = useState("極美品");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const combined = [...files, ...selected].slice(0, 5); // 最多 5 张
    setFiles(combined);

    const urls = combined.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const removeFile = (index: number) => {
    const nextFiles = files.filter((_, i) => i !== index);
    const nextPreviews = previews.filter((_, i) => i !== index);
    setFiles(nextFiles);
    setPreviews(nextPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError("お名前とメールアドレスをご入力ください。");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("brand", brand);
      formData.append("itemName", itemName);
      formData.append("condition", condition);
      formData.append("note", note);

      for (const file of files) {
        formData.append("images", file);
      }

      const res = await fetch("/api/sell", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "お申し込みの送信に失敗しました。");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "送信中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-[3px] border border-gold/40 bg-ivory p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="heading-jp mt-5 text-xl">査定のお申し込みを承りました</h3>
        <p className="mt-4 text-xs leading-relaxed text-ink/75 md:text-sm">
          お送りいただきました情報をもとに、専任の鑑定士が24時間以内に概算査定額をご案内いたします。
          <br className="hidden sm:inline" />
          ご登録のメールアドレス宛に受付完了のご案内をお送りいたしましたのでご確認ください。
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFiles([]);
            setPreviews([]);
            setItemName("");
            setNote("");
          }}
          className="btn-outline mt-8 inline-flex text-xs"
        >
          別のお品を申し込む
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[3px] border border-line bg-ivory p-6 shadow-sm md:p-10">
      {/* 方式选择 */}
      <div className="mb-8 flex rounded border border-line bg-cream p-1">
        <button
          type="button"
          onClick={() => setType("buyback")}
          className={`flex-1 py-2.5 text-xs tracking-wider transition-colors ${
            type === "buyback" ? "bg-gold text-ivory font-medium shadow-sm" : "text-ink/70 hover:text-ink"
          }`}
        >
          買取（最短即時のお支払い）
        </button>
        <button
          type="button"
          onClick={() => setType("consignment")}
          className={`flex-1 py-2.5 text-xs tracking-wider transition-colors ${
            type === "consignment" ? "bg-gold text-ivory font-medium shadow-sm" : "text-ink/70 hover:text-ink"
          }`}
        >
          委託販売（最大還元・高額売却）
        </button>
      </div>

      <div className="space-y-6 text-xs">
        {/* 客户联系方式 */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="block text-ink/80 mb-2 font-medium">
              お名前 <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="山田 太郎"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-ink/80 mb-2 font-medium">
              メールアドレス <span className="text-gold">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-ink/80 mb-2 font-medium">
            お電話番号（任意）
          </label>
          <input
            type="tel"
            placeholder="090-0000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
          />
        </div>

        {/* 物品信息 */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="block text-ink/80 mb-2 font-medium">
              ブランド
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
            >
              <option value="HERMÈS">HERMÈS（エルメス）</option>
              <option value="CHANEL">CHANEL（シャネル）</option>
              <option value="LOUIS VUITTON">LOUIS VUITTON</option>
              <option value="ROLEX">ROLEX（ロレックス）</option>
              <option value="OTHER">その他</option>
            </select>
          </div>
          <div>
            <label className="block text-ink/80 mb-2 font-medium">
              お品名・モデル
            </label>
            <input
              type="text"
              placeholder="例: バーキン 25 エプソン"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-ink/80 mb-2 font-medium">
              お品の状態
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
            >
              <option value="新品">新品（未使用・付属品完備）</option>
              <option value="極美品">極美品（数回使用・極めて良好）</option>
              <option value="美品">美品（一般的な中古・良好）</option>
              <option value="良品">良品（傷・スレ等の使用感あり）</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-ink/80 mb-2 font-medium">
            刻印・付属品・ご要望（任意）
          </label>
          <textarea
            rows={3}
            placeholder="製造刻印（例: Z刻印）、付属品（箱・保存袋・カデナ・鍵・レシート等）の有無や、ご希望金額などがございましたらご記入ください。"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded border border-line bg-cream/40 px-4 py-3 text-ink focus:border-gold focus:outline-none"
          />
        </div>

        {/* 图片上传 */}
        <div>
          <label className="block text-ink/80 mb-2 font-medium">
            お品の写真（最大5枚）
          </label>
          <p className="mb-3 text-[11px] text-ink/50">
            ※ 正面、背面、刻印、四隅、金具などの鮮明なお写真を添付いただくと、より精度の高い事前査定が可能です。
          </p>

          <div className="flex flex-wrap gap-4">
            {previews.map((src, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded border border-line">
                <Image src={src} alt="プレビュー" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink"
                >
                  ✕
                </button>
              </div>
            ))}

            {files.length < 5 && (
              <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-line bg-cream/50 text-ink/60 hover:border-gold hover:text-gold">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="mt-1 text-[10px]">写真追加</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {error && (
          <p className="rounded bg-red-50 p-3 text-xs text-red-600">
            {error}
          </p>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn-gold w-full justify-center py-4 text-center tracking-[0.2em]"
          >
            {submitting ? "査定情報を送信中..." : "無料査定を申し込む"}
          </button>
          <p className="mt-3 text-center text-[11px] text-ink/50">
            ※ ご送信いただいた情報および画像は査定目的以外には使用いたしません。
          </p>
        </div>
      </div>
    </form>
  );
}
