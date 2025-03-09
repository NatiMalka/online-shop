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
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        'bounce-in': 'bounce-in 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out forwards'
      }
    },
  },
  plugins: [],
} 