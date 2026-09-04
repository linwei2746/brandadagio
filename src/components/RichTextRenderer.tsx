import React from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";

interface RichTextRendererProps {
  content?: any;
  fallbackText?: string;
}

export default function RichTextRenderer({ content, fallbackText }: RichTextRendererProps) {
  if (content && content.root) {
    try {
      return (
        <div className="prose prose-stone max-w-none font-sans text-sm leading-relaxed text-ink/85 md:text-base">
          <RichText data={content} />
        </div>
      );
    } catch (err) {
      console.warn("[RichTextRenderer] failed to render lexical content:", err);
    }
  }

  // Fallback if content is not Lexical AST
  const paragraphs = fallbackText
    ? fallbackText.split("\n\n").filter(Boolean)
    : [
        "エルメスの魅力は、熟練の職人による手縫い（サドルステッチ）と最高峰のレザー素材の融合にあります。厳選された原皮から、わずか数パーセントの最良の部分のみを職人が見極め、数十時間におよぶ手作業を経て一つのバッグが生み出されます。",
        "真贋鑑定においては、ロゴの刻印の深さとフォントの繊細さ、金具のメッキの厚みとネジの研磨、レザー特有の質感とステッチの角度など、微細なポイントを多角的に検証します。確かな知識と経験を持つ専門鑑定士の目利きこそが、取引の信頼性を担保します。",
        "brandadagio では、東京・香港をはじめとする世界主要都市のネットワークを通じ、確かな鑑定を経た正規のコレクションのみを取り揃えております。お探しの特別な一品や、大切なお品の売却・委託販売など、専門のアドバイザーが心を込めてご案内いたします。",
      ];

  return (
    <div className="space-y-6 font-sans text-sm leading-relaxed text-ink/80 md:text-base">
      {paragraphs.map((para, index) => (
        <p key={index}>{para}</p>
      ))}
    </div>
  );
}
