/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff5c39",
          dark: "#141414",
          light: "#fff6f0",
          accent: "#2545ff",
        },
      },
    },
  },
  plugins: [],
};
