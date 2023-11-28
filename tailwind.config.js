/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app.js', './views/*.ejs', './views/partials/*.ejs'],
  theme: {
    container: {
      center: true
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      },
      colors: {
        'primary': '#2C3E50',
        
      }
    },
  },
  plugins: [],
}