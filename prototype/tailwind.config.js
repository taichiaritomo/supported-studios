/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    colors: {
      "light-blue": "#E5E5FF",
      "blue": "#0000f5",
      "green": "#027900",
      "red": "#DB0001"
    },
    extend: {},
  },
  plugins: [],
}

