/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0E1F3A",
        canvas: "#F4F6FB",
        surface: "#FFFFFF",
        brand: {
          blue: "#1B57D6",
          deep: "#1545AE",
          tint: "#EEF3FE",
        },
        emerald: "#0E9F6E",
        amber: "#E8A33D",
        line: "#E2E8F2",
        muted: "#5C6B86",
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
