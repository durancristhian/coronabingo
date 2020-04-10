// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig = require('tailwindcss/defaultConfig')

module.exports = {
  variants: {
    boxShadow: ['focus-within', ...defaultConfig.variants.boxShadow],
    opacity: ['disabled'],
    outline: ['focus-within', ...defaultConfig.variants.outline],
  },
}
