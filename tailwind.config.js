const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    fontFamily: {
      'bungee-shade': ['Bungee Shade', ...defaultTheme.fontFamily.sans],
      oswald: ['Oswald', ...defaultTheme.fontFamily.sans]
    }
  }
}
