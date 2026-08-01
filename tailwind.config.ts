import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08090c",
          900: "#0d0f14",
          800: "#12151c",
          700: "#1a1e28",
          600: "#242938",
          500: "#3a4055",
        },
        moss: {
          300: "#c5d6c9",
          400: "#9ab5a2",
          500: "#6f9179",
          600: "#4f6d59",
        },
        petal: {
          300: "#f0d5d5",
          400: "#e2b3b3",
          500: "#c98a8a",
        },
        dusk: {
          300: "#c9c5e0",
          400: "#a49ec5",
          500: "#7e75a8",
        },
        sand: {
          200: "#efe7d8",
          300: "#e0d3ba",
          400: "#c5b591",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Inter",
          "sans-serif",
        ],
        serif: ["ui-serif", "Georgia", "Cambria", "serif"],
      },
      backgroundImage: {
        "nebula":
          "radial-gradient(60% 60% at 30% 20%, rgba(126,117,168,0.28) 0%, transparent 60%), radial-gradient(70% 60% at 80% 90%, rgba(111,145,121,0.22) 0%, transparent 65%), radial-gradient(50% 50% at 60% 40%, rgba(201,138,138,0.14) 0%, transparent 60%)",
      },
      animation: {
        breathe: "breathe 8s ease-in-out infinite",
        drift: "drift 24s ease-in-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(0.92)", opacity: "0.7" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(-2%, 1%, 0)" },
        },
      },
    },
  },
} satisfies Config;
