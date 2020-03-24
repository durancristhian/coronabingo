const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    fontFamily: {
      inter: ['Inter', ...defaultTheme.fontFamily.sans],
      oswald: ['Oswald', ...defaultTheme.fontFamily.sans]
    }
  },
  variants: {
    opacity: ['disabled']
  }
}
