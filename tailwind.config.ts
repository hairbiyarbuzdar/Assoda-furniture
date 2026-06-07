import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm "slow furniture" palette (Stitch reference).
        cream: "#FBF3EC",
        blush: "#F3EAE3",
        maroon: {
          DEFAULT: "#5A2A2E",
          dark: "#3D1A1F",
        },
        ink: "#2B2522",
        muted: "#8A7F78",
        // Legacy tokens still used by the catalog FilterPill / dashboard.
        brand: {
          DEFAULT: "#5A2A2E",
          accent: "#5A2A2E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
