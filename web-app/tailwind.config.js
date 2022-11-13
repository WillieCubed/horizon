/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto"],
      },
      color: {
        primary: {
          DEFAULT: "#3454D1",
        },
        secondary: {
          DEFAULT: "#F85E00",
        },
        background: "#F9F7F0",
      },
    },
  },
  plugins: [],
};
