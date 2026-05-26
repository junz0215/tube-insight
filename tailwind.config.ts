import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "basalt-canvas": "#e2e2df",
        "ash-white": "#f7f6f2",
        "abyssal-ink": "#070607",
        "pure-white": "#ffffff",
        "digital-orange": "#fc5000",
        "cyber-violet": "#524ae9",
        "pixel-glare": "#f5f28e",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["'DM Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "card": "40px",
        "input": "100px",
        "btn": "800px",
      },
      letterSpacing: {
        display: "0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
