import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        sand: "#f7f3ee",
        stone: "#d8d2c8",
        mist: "#f5f5f2",
        slate: "#6d6b67",
        gold: "#a67c52",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "\"SF Pro Text\"", "\"Helvetica Neue\"", "sans-serif"],
        serif: ["Iowan Old Style", "Palatino", "\"Times New Roman\"", "serif"],
      },
      boxShadow: {
        card: "0 20px 60px rgba(17, 17, 17, 0.08)",
        soft: "0 10px 30px rgba(17, 17, 17, 0.06)",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "float-in": "floatIn 500ms ease-out",
        "pulse-glow": "pulseGlow 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
