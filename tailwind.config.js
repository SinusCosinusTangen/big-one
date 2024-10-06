/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      textUnderlineOffset: {
        10: '0.5rem',
      }
    },
  },
  plugins: [],
}
