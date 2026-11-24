/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Syne"', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        espresso: {
          DEFAULT: '#2C1D18',
          dark: '#1E1410',
          deep: '#140D0A',
          muted: '#523C34'
        },
        cream: {
          DEFAULT: '#F4F0EB',
          light: '#FAF8F5',
          sand: '#EFECE6',
          border: 'rgba(44, 29, 24, 0.12)'
        },
        bronze: {
          DEFAULT: '#C89D7C',
          dark: '#A67954',
          light: '#DEBC9F'
        }
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        wide: '0.15em',
        widest: '0.25em'
      }
    },
  },
  plugins: [],
}
