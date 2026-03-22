/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#4A72A8',
          dark: '#1A3A6B',
          bg: '#0D0D0D',
          light: '#E8EFF9',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      }
    },
  },
  plugins: [],
}
