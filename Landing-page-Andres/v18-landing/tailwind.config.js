/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0A0A',
        champagne: '#E8DCC8',
        bone: '#F5F0E8',
        graphite: '#2A2A2A',
        smoke: '#8A8A8A',
      },
      fontFamily: {
        display: ['Canela', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
