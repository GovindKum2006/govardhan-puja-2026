/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        sacred: {
          gold: '#FFB800',
          yellow: '#FFD700',
          deepOrange: '#E65100',
          maroon: '#800020',
          green: '#1B5E20',
          emerald: '#10B981',
          cream: '#FFFDF7',
          darkRed: '#880e4f',
        }
      },
      fontFamily: {
        hindi: ['"Mukta"', '"Noto Sans Devanagari"', 'sans-serif'],
        heading: ['"Rozha One"', '"Cinzel"', 'serif'],
        sans: ['"Outfit"', '"Inter"', 'sans-serif'],
      },
      animation: {
        'diya-flicker': 'flicker 2s infinite ease-in-out',
        'float-gentle': 'float 4s infinite ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', opacity: '0.9' },
          '50%': { transform: 'scale(1.08) rotate(1.5deg)', opacity: '1', filter: 'drop-shadow(0 0 10px rgba(255,184,0,0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
