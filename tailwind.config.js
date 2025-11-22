/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "skilio-primary": "#38C87B",
        "skilio-secondary": "#62BE76",
        "skilio-tertiary": "#1C9085",
        "skilio-dark": "#13444E",
        "skilio-accent": "#B7E82A",
      },
    },
  },
  plugins: [],
};
