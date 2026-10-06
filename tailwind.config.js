/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        slideUp: "slideUp 0.5s ease-in-out",
        pop: "pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        blob: "blob 14s ease-in-out infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        floatSlower: "floatSlow 9s ease-in-out infinite reverse infinite",
        sheen: "sheen 2.4s ease-in-out infinite",
        gradientX: "gradientX 8s ease infinite",
        pulseRing: "pulseRing 2.6s ease-out infinite",
        spinSlow: "spinSlow 18s linear infinite",
        bob: "bob 2.4s ease-in-out infinite",
        rise: "rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        blob: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(28px, -34px, 0) scale(1.08)" },
          "66%": { transform: "translate3d(-22px, 20px, 0) scale(0.94)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        sheen: {
          "0%": { transform: "translateX(-130%) skewX(-18deg)" },
          "100%": { transform: "translateX(240%) skewX(-18deg)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "70%, 100%": { transform: "scale(1.6)", opacity: "0" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(16 185 129 / 0.25), 0 18px 45px -18px rgb(16 185 129 / 0.55)",
        "glow-orange":
          "0 0 0 1px rgb(249 115 22 / 0.25), 0 18px 45px -18px rgb(249 115 22 / 0.55)",
        "glow-violet":
          "0 0 0 1px rgb(139 92 246 / 0.25), 0 18px 45px -18px rgb(139 92 246 / 0.55)",
        card: "0 24px 60px -30px rgb(15 23 42 / 0.45)",
      },
    },
  },
  plugins: [],
};