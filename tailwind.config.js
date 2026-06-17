/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        brand: {
          50: "#F0F5FA",
          100: "#DCE7F2",
          200: "#B3CCE3",
          300: "#80A8CF",
          400: "#4D84BA",
          500: "#1E3A5F",
          600: "#18304E",
          700: "#12253C",
          800: "#0C1A2A",
          900: "#060D15",
        },
        silver: {
          50: "#F5F7F9",
          100: "#E4E9EE",
          200: "#C8D3DD",
          300: "#ABBCCB",
          400: "#8A9BA8",
          500: "#6C7E8D",
          600: "#556370",
          700: "#3E4852",
          800: "#282E35",
          900: "#14171A",
        },
        apple: {
          green: "#34C759",
          orange: "#FF9500",
          red: "#FF3B30",
          blue: "#007AFF",
          purple: "#AF52DE",
          pink: "#FF2D55",
          yellow: "#FFCC00",
        },
      },
      fontFamily: {
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        "xl": "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 2px 16px rgba(30, 58, 95, 0.08)",
        medium: "0 8px 32px rgba(30, 58, 95, 0.12)",
        heavy: "0 16px 48px rgba(30, 58, 95, 0.16)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.12)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
