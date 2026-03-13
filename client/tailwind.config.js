/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B3A6B',
          dark: '#0D1F3C',
          light: '#254d8a',
        },
        gold: {
          DEFAULT: '#C5A44E',
          light: '#D4B85A',
          dark: '#A8893E',
        },
        red: {
          DEFAULT: '#D32F2F',
          light: '#E53935',
          dark: '#B71C1C',
        },
      },
      fontFamily: {
        display: ['Oswald', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
