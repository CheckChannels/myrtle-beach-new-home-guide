/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B3558',
          dark: '#071f36',
          light: '#1a4f7a',
        },
        teal: {
          DEFAULT: '#0E7C7B',
          light: '#DFF4F1',
          dark: '#0a5f5e',
        },
        sand: {
          DEFAULT: '#E9DCCB',
          light: '#F7F3EC',
          dark: '#c8b89a',
        },
        coral: {
          DEFAULT: '#D96C4A',
          light: '#f5e6e0',
          dark: '#b85a3a',
        },
        surface: '#FFFFFF',
        bg: '#F8FAF9',
        border: '#E6ECEF',
        muted: '#5F6F7E',
        primary: '#102A43',
        success: '#1F9D55',
        warning: '#D99A2B',
        error: '#C0392B',
      },
    },
  },
  plugins: [],
}
