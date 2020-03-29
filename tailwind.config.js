const defaultConfig = require('tailwindcss/defaultConfig')

module.exports = {
  theme: {
    fontFamily: {
      inter: ['Inter', ...defaultConfig.theme.fontFamily.sans],
      oswald: ['Oswald', ...defaultConfig.theme.fontFamily.sans]
    }
  },
  variants: {
    boxShadow: ['focus-within', ...defaultConfig.variants.boxShadow],
    opacity: ['disabled'],
    outline: ['focus-within', ...defaultConfig.variants.outline],
  }
}
