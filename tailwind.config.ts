import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        "background-color1": "var(--background-color1)",
        "blackblack-100": "var(--blackblack-100)",
        "blackblack-60": "var(--blackblack-60)",
        "color-primary": "var(--color-primary)",
        "main-100": "var(--main-100)",
        mainlinear: "var(--mainlinear)",
        "neutral-grey-3": "var(--neutral-grey-3)",
        "neutral-grey-5": "var(--neutral-grey-5)",
        "neutral-white": "var(--neutral-white)",
        "neutralgrey-4": "var(--neutralgrey-4)",
        "neutralgrey-6": "var(--neutralgrey-6)",
        neutralwhite: "var(--neutralwhite)",
        "sec-100": "var(--sec-100)",
        "secondary-100": "var(--secondary-100)",
        stroke: "var(--stroke)",
        "text-10": "var(--text-10)",
        "text-100": "var(--text-100)",
      },
      fontFamily: {
        inter: ["Inter", "Helvetica", "sans-serif"],
        rubik: ["Rubik", "Helvetica", "sans-serif"],
        "body-small-regular": ["var(--body-small-regular-font-family)"],
        "body-standard-medium": ["var(--body-standard-medium-font-family)"],
        "h3-32px": ["var(--h3-32px-font-family)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
