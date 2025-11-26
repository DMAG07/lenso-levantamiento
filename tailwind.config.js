export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Lenso Brand Colors
        lenso: {
          green: {
            800: '#275b35',
            900: '#1a3d24',
          },
          orange: {
            500: '#a85636',
            600: '#8f4329',
          },
          purple: {
            500: '#81598b',
            600: '#6a4973',
          }
        },
        // Base colors from template
        navy: {
          700: '#1e293b',
          800: '#0f172a',
          900: '#0a0f1e',
        },
        titanium: {
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          700: '#334155',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      }
    }
  },
  plugins: []
}
