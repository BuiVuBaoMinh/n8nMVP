/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",      // <--- Good practice to include
  ],
  theme: {
    extend: {
      colors: {
        // Optional: Define your palette variables here for cleaner code later
        n8n: {
          teal: '#09637e',
          action: '#088395',
          soft: '#7ab2b2',
          ice: '#ebf4f6',
        }
      }
    },
  },
  plugins: [],
}