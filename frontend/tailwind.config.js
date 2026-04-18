/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#080808",
        surface: "#111111",
        surface2: "#1a1a1a",
        border: "#222222",
        income: "#22c55e",
        incomeGlow: "#16a34a",
        incomeLight: "#bbf7d0",
        expense: "#ef4444",
        expenseGlow: "#dc2626",
        expenseLight: "#fecaca",
        accent: "#facc15",
        muted: "#6b7280",
        text: "#f9fafb",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        income: "0 0 0 1px rgba(34,197,94,0.2), 0 18px 36px -18px rgba(34,197,94,0.55)",
        expense: "0 0 0 1px rgba(239,68,68,0.2), 0 18px 36px -18px rgba(239,68,68,0.55)",
        accent: "0 0 0 1px rgba(250,204,21,0.18), 0 18px 36px -18px rgba(250,204,21,0.45)",
      },
      keyframes: {
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34,197,94,0)" },
          "50%": { boxShadow: "0 0 26px 2px rgba(34,197,94,0.28)" },
        },
        "count-up": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "60%": { opacity: "1", transform: "scale(1.05)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.4s ease forwards",
        "slide-in-right": "slide-in-right 0.3s ease forwards",
        "fade-in": "fade-in 0.5s ease forwards",
        "glow-pulse": "glow-pulse 2s infinite",
        "count-up": "count-up 0.4s ease forwards",
        shimmer: "shimmer 1.5s linear infinite",
        "bounce-in": "bounce-in 0.5s ease forwards",
      },
    },
  },
  plugins: [],
};
