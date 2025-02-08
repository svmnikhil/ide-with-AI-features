/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./embed/index.html",
    "./js/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'judge0': {
          'primary': '#1a73e8',
          'secondary': '#4285f4',
        }
      },
      fontFamily: {
        'jetbrains': ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
  // This ensures Tailwind classes don't conflict with Semantic UI
  important: true,
  // Prefix Tailwind classes to avoid conflicts
  prefix: 'tw-',
  // Don't purge Semantic UI classes
  safelist: [
    /^ui-/,
    /^semantic-/
  ]
} 