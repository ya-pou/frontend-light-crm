/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#0b1120',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f3f4f6',
        },
      },
    },
  },
  plugins: [],
};