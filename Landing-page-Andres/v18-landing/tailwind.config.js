/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0E0E0E',
        'bg-elevated': '#1A1A1A',
        text: '#F5F0EB',
        'text-muted': '#8A8580',
        accent: '#C4A882',
        'accent-hover': '#D4B892',
        border: '#2A2A2A',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
