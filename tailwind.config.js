/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-mode="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        padding: "4vw",
        center: true,
      },
      fontSize: {
        lg: ["19px", { lineHeight: "1.75rem" }],
      },
    },
  },
  plugins: [],
};
