/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aura: {
          bg: '#F9F8F4',
          primary: '#2D3A31',
          sage: '#8C9A84',
          clay: '#DCCFC2',
          terra: '#C27B66',
          gold: '#C8A46B',
          dark: '#1A1A1A',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Source Sans 3', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
