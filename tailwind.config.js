const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Sans Pro', ...defaultTheme.fontFamily.sans],
      },
      minHeight: (theme) => ({
          ...theme('spacing'),
      }),
      minWidth: (theme) => ({
          ...theme('spacing'),
      }),
    },
  },
  plugins: [],
}
