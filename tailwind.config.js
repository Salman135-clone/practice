/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // important!
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};
