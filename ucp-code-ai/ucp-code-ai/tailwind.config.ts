import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: { brand: { blue: "#3d8bff", violet: "#8b5cff", cyan: "#22d3ee" } },
      fontFamily: { mono: ["var(--mono)"], sans: ["var(--sans)"] },
    },
  },
  plugins: [],
};
export default config;
