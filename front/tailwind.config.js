/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'display': ['Poppins', 'sans-serif'],
        'body': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

