/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0059ff',
        secondary: '#4d8bff',
        accent: '#a3c2ff',
        light: '#e6f0ff',
      },
      fontFamily: {
        arabic: ['Tajawal', 'sans-serif'],
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      backgroundOpacity: {
        '10': '0.1',
        '20': '0.2',
        '95': '0.95',
      },
    },
  },
  plugins: [],
}