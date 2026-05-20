/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        nox: {
          bg:      'var(--bg)',
          surface: 'var(--surface)',
          border:  'var(--border)',
          text:    'var(--text)',
          muted:   'var(--muted)',
          accent:  'var(--accent)',
        },
        danger: '#f85149',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
