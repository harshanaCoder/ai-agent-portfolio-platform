import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sections/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"]
      },
      colors: {
        // Extended color palette for better component styling
        surface: {
          50: "rgba(255, 255, 255, 0.02)",
          100: "rgba(255, 255, 255, 0.05)",
          150: "rgba(255, 255, 255, 0.07)",
          200: "rgba(255, 255, 255, 0.10)",
          300: "rgba(255, 255, 255, 0.15)"
        }
      },
      spacing: {
        // Refined spacing scale
        xs: "0.5rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2.5rem",
        "3xl": "3rem",
        "4xl": "4rem"
      },
      fontSize: {
        // Enhanced typography scale
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.01em" }],
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "3.5rem" }],
        "6xl": ["3.75rem", { lineHeight: "4.5rem" }],
        "7xl": ["4.5rem", { lineHeight: "5.625rem" }],
        "8xl": ["6rem", { lineHeight: "1" }]
      },
      borderRadius: {
        // Consistent radius system
        "sm": "0.375rem",
        "base": "0.5rem",
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem"
      },
      boxShadow: {
        // Refined shadow system
        "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "base": "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
        "md": "0 4px 8px 0 rgba(0, 0, 0, 0.12)",
        "lg": "0 8px 16px 0 rgba(0, 0, 0, 0.15)",
        "xl": "0 12px 24px 0 rgba(0, 0, 0, 0.18)",
        "neon": "0 0 0 1px rgba(74, 222, 255, 0.2), 0 24px 80px rgba(30, 144, 255, 0.18)",
        "card": "0 24px 70px rgba(5, 8, 22, 0.45)",
        "card-hover": "0 32px 96px rgba(74, 222, 255, 0.12)"
      },
      backgroundImage: {
        "mesh-grid": "linear-gradient(rgba(74,222,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,255,0.08) 1px, transparent 1px)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(74,222,255,0.25)" },
          "50%": { boxShadow: "0 0 0 12px rgba(74,222,255,0)" }
        },
        sweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" }
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" }
        }
      },
      animation: {
        float: "float 9s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        sweep: "sweep 3s linear infinite",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        shimmer: "shimmer 2s infinite"
      },
      transitionProperty: {
        // Common transition combinations
        "colors": "color, background-color, border-color, fill, stroke",
        "standard": "all"
      },
      transitionDuration: {
        "200": "200ms",
        "300": "300ms"
      }
    }
  },
  plugins: []
};

export default config;