/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#344E41',
          primary: '#344E41',
          deep: '#24372E',
          accent: '#1B2922',
          sage: '#E7EDE8',
          pale: '#F3F6F3',
          border: '#E4E9E4',
          text: '#1F2722',
          muted: '#68736C',
          hover: '#2a3f35',
          light: '#f0f4f1'
        },
        surface: {
          app: 'var(--color-bg-app)',
          card: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-surface-elevated)',
          muted: 'var(--color-bg-muted)',
          border: 'var(--color-border)',
        },
        content: {
          main: 'var(--color-text-main)',
          secondary: 'var(--color-text-muted)',
          inverted: 'var(--color-text-inverted)',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'canvas': '28px',
        'super': '32px'
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(36, 55, 46, 0.04), 0 2px 6px -1px rgba(36, 55, 46, 0.02)',
        'canvas': '0 10px 40px -10px rgba(31, 39, 34, 0.05)',
        'modal': '0 20px 50px -12px rgba(27, 41, 34, 0.25)',
        'dropdown': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}

