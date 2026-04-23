import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          bg: "#050508",
          violet: "#8B5CF6",
          cyan: "#22D3EE",
          rose: "#FB7185",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "scroll-x": "scroll-x 40s linear infinite",
        "scroll-x-reverse": "scroll-x-reverse 40s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "scroll-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-x-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
