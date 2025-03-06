/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
      },
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'scale(0.95) translateX(-50%)', opacity: 0 },
          '50%': { transform: 'scale(1.05) translateX(-50%)', opacity: 0.8 },
          '100%': { transform: 'scale(1) translateX(-50%)', opacity: 1 }
        }
      },
      animation: {
        'bounce-in': 'bounce-in 0.3s ease-out'
      }
    },
  },
  plugins: [],
} 