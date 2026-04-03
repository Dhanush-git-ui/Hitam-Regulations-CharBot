/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#16A34A',
          light: '#DCFCE7',
        },
        gray: {
          50: '#F9FAFB', // Background
          100: '#F3F4F6',
          200: '#E5E7EB', // Border
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280', // Text Secondary
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827', // Text Primary
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
