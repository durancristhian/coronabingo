/* eslint-disable @typescript-eslint/no-var-requires */

const emojiLabels = require('./utils/emojiLabels.json')

const purgecss = [
  '@fullhuman/postcss-purgecss',
  {
    content: [
      './components/**/*.tsx',
      './pages/**/*.tsx',
      './utils/backgroundCell.ts',
      {
        raw: Object.keys(emojiLabels)
          .map(name => `em-${name}`)
          .join(' '),
        extension: 'html',
      },
    ],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
  },
]

module.exports = {
  plugins: [
    'postcss-import',
    'tailwindcss',
    'autoprefixer',
    ...(process.env.NODE_ENV !== 'development' ? [purgecss] : []),
  ],
}
