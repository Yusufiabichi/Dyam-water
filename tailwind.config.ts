
import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9dfff',
          300: '#7cc4ff',
          400: '#36a5ff',
          500: '#1A5091',
          600: '#154075',
          700: '#10305a',
          800: '#0b2040',
          900: '#061025',
        },
        brand: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9dfff',
          300: '#7cc4ff',
          400: '#36a5ff',
          500: '#1A5091',
          600: '#154075',
          700: '#10305a',
          800: '#0b2040',
          900: '#061025',
        },
        charity: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#DC2626',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
        },
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#1A5091',
          600: '#154075',
          700: '#10305a',
          800: '#0b2040',
          900: '#061025',
        },
        navy: {
          500: '#1A5091',
          600: '#154075',
          700: '#10305a',
          800: '#0b2040',
          900: '#061025',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
