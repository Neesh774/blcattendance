/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lexend Deca", "sans-serif"],
        display: ["Source Sans Pro", "sans-serif"],
      },
      colors: {
        text: {
          500: "#313131",
          400: "#444444",
          300: "#5F5F5F",
          200: "#909090",
          100: "#979797",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
