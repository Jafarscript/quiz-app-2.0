/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "leftGradient": "#000000e5",
        "rightGradient": "#00000026"
      },
    },
  },
  plugins: [],
};
