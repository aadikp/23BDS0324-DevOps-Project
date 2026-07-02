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
          50:  '#eef9ff',
          100: '#d8f0ff',
          200: '#b9e5ff',
          300: '#89d6ff',
          400: '#52beff',
          500: '#2a9fff',
          600: '#0f7ef5',
          700: '#0a68e1',
          800: '#0f54b6',
          900: '#13488f',
          950: '#112d5e',
        },
        surface: {
          DEFAULT: '#0f172a',
          card:    '#1e293b',
          border:  '#334155',
          muted:   '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Outfit', 'ui-sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        'card-gradient': 'linear-gradient(145deg, #1e293b, #0f172a)',
        'brand-gradient': 'linear-gradient(135deg, #0a68e1, #2a9fff)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(42, 159, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(42, 159, 255, 0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
