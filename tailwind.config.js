/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app.js', './views/*.ejs', './views/partials/*.ejs'],
  theme: {
    container: {
      centre: true
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      },
      colors: {
        'primary': '#001F3F',
        
      }
    },
  },
  plugins: [],
}