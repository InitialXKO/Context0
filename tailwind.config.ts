import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: '#34d399',
          indigo: '#6366f1',
          gold: '#facc15',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 25px 50px -12px rgba(16, 185, 129, 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
