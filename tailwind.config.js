/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false, // 明示的に無効化（オプション）
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
