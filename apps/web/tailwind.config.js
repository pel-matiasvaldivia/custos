/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0e1f3a',
        canvas: '#f4f6fb',
        surface: '#ffffff',
        'brand-blue': '#1b57d6',
        'brand-deep': '#1545ae',
        'brand-tint': '#eef3fe',
        emerald: '#0e9f6e',
        amber: '#e8a33d',
        line: '#e2e8f2',
        muted: '#5c6b86',
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
