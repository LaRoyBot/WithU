import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#f5efff",
          100: "#ebdfff",
          200: "#d8c0ff",
          300: "#bb91ff",
          400: "#9c5cff",
          500: "#7a00df",
          600: "#6800c4",
          700: "#5500a3",
          800: "#440082",
          900: "#39006b",
        }
      },
    },
  },
  plugins: [],
};
export default config;
