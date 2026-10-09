/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: '#FDFBF7',
          cream: '#FAF4EC',
          sand: '#F3EAD8',
          saffron: {
            DEFAULT: '#E06D14',
            light: '#F58A38',
            dark: '#B85006',
          },
          terracotta: '#C2410C',
          maroon: {
            DEFAULT: '#7B1828',
            dark: '#580F1B',
            light: '#9E2437',
          },
          gold: {
            DEFAULT: '#D4AF37',
            light: '#E6C65C',
            dark: '#A68417',
          },
          charcoal: '#1F1E1D',
          slate: '#363432',
          stone: '#5C5854',
          muted: '#8C857E',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
