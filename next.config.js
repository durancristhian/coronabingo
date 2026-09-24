/* eslint-disable @typescript-eslint/no-var-requires */

require('dotenv').config()

const { join } = require('path')

const tsconfig = require('./tsconfig.json')
const tsPaths = tsconfig.compilerOptions.paths
const { locales, defaultLocale, localeDetection } = require('./i18n.json')

const nextTranslate = require('next-translate-plugin')
const uiTests = process.env.UI_TESTS === '1'
if (uiTests) {
  const { appEnv } = require('./tests/ui/environment')
  for (const [name, value] of Object.entries(appEnv)) {
    if (process.env[name] !== value) {
      throw new Error(
        `Invalid UI test configuration: ${name}. Use npm run ui-tests.`,
      )
    }
  }
} else if (process.env.FIRESTORE_EMULATOR_HOST || process.env.UI_TESTS) {
  throw new Error(
    'Emulator configuration requires the isolated UI test runner.',
  )
}
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: Boolean(process.env.ANALYZE_BUNDLE),
  openAnalyzer: false,
})

const nextConfig = {
  ...(uiTests && {
    distDir: '.next-ui-tests',
    typescript: { tsconfigPath: 'tsconfig.ui-tests.json' },
  }),
  i18n: { locales, defaultLocale, localeDetection },
  images: { disableStaticImages: true },
  productionBrowserSourceMaps: true,
  env: {
    UI_TESTS: uiTests ? '1' : '',
    FIRESTORE_EMULATOR_HOST: uiTests ? process.env.FIRESTORE_EMULATOR_HOST : '',
    /* FIREBASE */
    API_KEY: process.env.API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    PROJECT_ID: process.env.PROJECT_ID,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
    MEASUREMENT_ID: process.env.MEASUREMENT_ID,
    /* Google Analytics */
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    /* Sentry */
    SENTRY_DSN: process.env.SENTRY_DSN,
    /* Other */
    URL: process.env.URL,
  },
  webpack: config => {
    /*
      Convert tsconfig path
      { '@components/*': [ './src/components/*' ] }

      To webpack aliases
      { config.resolve.alias['@components'] = path.join(__dirname, './src/components') }
    */
    Object.keys(tsPaths).forEach(key => {
      const newKey = key.replace('/*', '')
      const value = tsPaths[key][0].replace('/*', '')

      config.resolve.alias[newKey] = join(__dirname, value)
    })

    config.module.rules.push({
      test: /\.(jpg|jpeg|png|svg|gif|ico|webp|jp2|avif|mp3)$/,
      issuer: /\.[jt]sx?$/,
      type: 'asset',
      parser: { dataUrlCondition: { maxSize: 8192 } },
    })

    return config
  },
}

module.exports = withBundleAnalyzer(nextTranslate(nextConfig))
