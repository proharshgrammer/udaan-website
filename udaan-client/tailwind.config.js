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
          blue: '#30618C',
          dark_blue: '#4a72a8',
          muted: '#8EA8BF',
          accent: '#B8CAD9',
          light: '#F2F2F2',
          bg: '#0D0D0D',
          dark: '#0D0D0D',
        }
      },
      height: {
        screen: '100dvh',
      },
      minHeight: {
        screen: '100dvh',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      }
    },
  },
  plugins: [],
  // Trigger HMR
}
