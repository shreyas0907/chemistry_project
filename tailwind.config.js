/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#08120E', // deep forest-slate background
          900: '#0B1712',
          850: '#0F1F19', // moss-dark bento card background
          800: '#142921',
          700: '#1C382D',
          600: '#254A3C',
        },
        botanical: {
          lime: '#84CC16',
          emerald: '#10B981',
          teal: '#14B8A6',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          coral: '#F43F5E',
          sage: '#6EE7B7',
          mint: '#A7F3D0',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderColor: {
        'bento-border': 'rgba(16, 185, 129, 0.15)',
      },
      backgroundColor: {
        'bento-card': 'rgba(15, 31, 25, 0.85)',
      }
    },
  },
  plugins: [],
}
