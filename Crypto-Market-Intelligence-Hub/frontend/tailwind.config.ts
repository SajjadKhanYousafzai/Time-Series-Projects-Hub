import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark fintech palette
        background: {
          DEFAULT: "#0a0e1a",
          secondary: "#0f1629",
          card: "#1a1f3c",
        },
        primary: {
          DEFAULT: "#00d4ff",
          50: "#e0fbff",
          100: "#b3f5ff",
          200: "#80eeff",
          300: "#4de7ff",
          400: "#1ae0ff",
          500: "#00d4ff",
          600: "#00aace",
          700: "#007f9c",
          800: "#00556a",
          900: "#002a38",
        },
        accent: {
          DEFAULT: "#7c3aed",
          hover: "#6d28d9",
        },
        success: "#00ff88",
        danger: "#ff4466",
        warning: "#ffaa00",
        border: "#2d3561",
        muted: "#64748b",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #0a0e1a 0%, #1a1f3c 50%, #0f1629 100%)",
        "card-gradient": "linear-gradient(135deg, #1a1f3c 0%, #0f1629 100%)",
        "glow-blue": "radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 212, 255, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.6)" },
        },
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(0, 212, 255, 0.3)",
        "glow-purple": "0 0 20px rgba(124, 58, 237, 0.3)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
