/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "node_modules/@coreui/**/*.js" // Include CoreUI files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

