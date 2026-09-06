/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070a13",
        surface: {
          DEFAULT: "#0d1322",
          50: "#131b30",
          100: "#18233e",
          card: "rgba(13, 19, 34, 0.75)",
          glass: "rgba(18, 26, 47, 0.55)",
          border: "rgba(255, 255, 255, 0.08)",
        },
        brand: {
          blue: {
            DEFAULT: "#3b82f6",
            dark: "#1d4ed8",
            light: "#60a5fa",
            glow: "rgba(59, 130, 246, 0.2)",
          },
          purple: {
            DEFAULT: "#8b5cf6",
            dark: "#6d28d9",
            light: "#a78bfa",
            glow: "rgba(139, 92, 246, 0.2)",
          },
          teal: {
            DEFAULT: "#06b6d4",
            dark: "#0891b2",
            light: "#22d3ee",
            glow: "rgba(6, 182, 212, 0.2)",
          },
          emerald: {
            DEFAULT: "#10b981",
            light: "#34d399",
          },
          amber: {
            DEFAULT: "#f59e0b",
            light: "#fbbf24",
          },
          rose: {
            DEFAULT: "#f43f5e",
            light: "#fb7185",
          }
        },
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(circle at 50% 15%, rgba(59, 130, 246, 0.18), rgba(139, 92, 246, 0.08) 35%, transparent 70%)",
        "mesh-gradient": "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(6, 182, 212, 0.06) 100%)",
        "card-highlight": "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
      },
      boxShadow: {
        "glow-blue": "0 0 35px -5px rgba(59, 130, 246, 0.3)",
        "glow-purple": "0 0 35px -5px rgba(139, 92, 246, 0.3)",
        "glow-teal": "0 0 35px -5px rgba(6, 182, 212, 0.3)",
        "glass-card": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 5s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        }
      }
    },
  },
  plugins: [],
};
