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
        golden: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // Golden Trophy Principal
          600: "#d97706", // Golden Sunset / Bronze
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        dark: {
          700: "#374151",
          800: "#1f2937", // Carbon Grip (Tarjetas)
          900: "#111827", // Obsidian Court (Contenedores)
          950: "#0b0f17", // Deep Court (Fondo Principal)
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        "golden-glow": "0 0 25px -5px rgba(245, 158, 11, 0.4)",
        "golden-glow-lg": "0 0 50px -10px rgba(245, 158, 11, 0.5)",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
