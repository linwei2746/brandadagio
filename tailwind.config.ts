import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DEAREST 系：白基調 × 暖褐 × ゴールド
        ink: "#271d17", // 主要テキスト / 暖かな濃褐
        charcoal: "#1a1b18",
        taupe: "#62554e", // 見出し補助・やわらかな褐
        ivory: "#ffffff", // 主背景＝白
        cream: "#faf6f0", // ごく淡い温白（交互セクション）
        sand: "#f4ede2", // やや濃い温白
        blush: "#de927c", // ウォーターマーク用サーモン
        gold: "#b6915b", // アクセント（DEAREST のゴールド）
        "gold-light": "#cdae82",
        stone: "#8a7d72", // 補助テキスト
        line: "#eae1d3", // 罫線
      },
      fontFamily: {
        // 明朝（和）＋ EB Garamond（欧）
        serif: ["var(--font-eb)", "var(--font-noto-serif-jp)", "serif"],
        mincho: ["var(--font-noto-serif-jp)", "serif"],
        garamond: ["var(--font-eb)", "serif"],
        sans: ["var(--font-noto-sans-jp)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.35em",
        xwide: "0.4em",
        wide2: "0.2em",
      },
      maxWidth: {
        content: "1240px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
