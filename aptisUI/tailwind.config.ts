import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.75rem",
        sm: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3.5rem",
      },
      screens: {
        sm: "540px",
        md: "720px",
        lg: "960px",
        xl: "1140px",
        "2xl": "1320px",
      },
    },
    corePlugins: {
      container: true,
    },
    extend: {
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(20px)",
          },
          "100%": {
            opacity: "1", // Kết thúc hiển thị
            transform: "translateX(0)",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "fade-in-left": "fade-in-left 0.5s ease-out forwards",
        "fade-in-right": "fade-in-right 0.6s ease-out forwards",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        teal: {
          50: "#e6fffa",
          100: "#b2f5ea",
          200: "#81e6d9",
          300: "#4fd1c5",
          400: "#38b2ac",
          500: "#319795",
          600: "#2c7a7b",
          700: "#285e61",
          800: "#234e52",
          900: "#1d4044",
        },
        // Eduka specific colors from original CSS
        "eduka-theme-color": "#116e63", // --theme-color
        "eduka-theme-color2": "#FDA31B", // --theme-color2
        "eduka-theme-color-light": "rgb(17, 110, 99, 0.09)", // --theme-color-light
        "eduka-bg-light": "#F2F3F5", // --theme-bg-light
        "eduka-body-text": "#757F95", // --body-text-color
        "eduka-dark-text": "#19232B", // --color-dark
        "eduka-hero-overlay": "#000000", // --hero-overlay-color
        "eduka-slider-arrow-bg": "rgba(255, 255, 255, 0.2)", // --slider-arrow-bg
        "eduka-border-info": "rgba(0, 0, 0, 0.08)", // --border-info-color
        "eduka-footer-bg": "#012758", // --footer-bg
        "eduka-footer-text": "#F5FAFF", // --footer-text-color
        "eduka-blue": "#0000FF", // Added for consistency with image
      },
      boxShadow: {
        "eduka-shadow": "0 0 40px 5px rgb(0 0 0 / 5%)", // --box-shadow
        "eduka-shadow2": "0 0 15px rgba(0, 0, 0, 0.17)", // --box-shadow2
        "eduka-icon-shadow": "-5px 5px 0 rgba(17, 110, 99, 0.09)", // Custom shadow for about us icons
      },
      transitionTimingFunction: {
        "eduka-ease-in-out": "ease-in-out", // --transition
      },
      transitionDuration: {
        "eduka-500": "500ms", // --transition
        "eduka-300": "300ms", // --transition2
      },
      fontFamily: {
        body: ["Roboto", "sans-serif"], // --body-font
        heading: ["Yantramanav", "sans-serif"], // --heading-font
      },
      borderRadius: {
        "eduka-50-0": "50px 50px 50px 0",
        "eduka-40-0": "40px 40px 40px 0",
        "eduka-80-0": "80px 80px 80px 0",
        "eduka-30-0": "30px 30px 30px 0",
        "eduka-circle-custom": "30% 70% 70% 30% / 30% 30% 70% 70%", // For counter icon
      },
      // borderRadius: {
      //   lg: "var(--radius)",
      //   md: "calc(var(--radius) - 2px)",
      //   sm: "calc(var(--radius) - 4px)",
      //   xl: "1rem",
      //   "2xl": "1.5rem",
      // },
      //   animation: {
      //     "pulse-border": "pulse-border 1.8s linear infinite",
      //     "accordion-down": "accordion-down 0.2s ease-out",
      //     "accordion-up": "accordion-up 0.2s ease-out",
      //   },
      //   keyframes: {
      //     "accordion-down": {
      //       from: {
      //         height: "0",
      //       },
      //       to: {
      //         height: "var(--radix-accordion-content-height)",
      //       },
      //     },
      //     "accordion-up": {
      //       from: {
      //         height: "var(--radix-accordion-content-height)",
      //       },
      //       to: {
      //         height: "0",
      //       },
      //     },
      //   },
    },
  },
  plugins: [],
};
export default config;
