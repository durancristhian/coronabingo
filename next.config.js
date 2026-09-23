/* eslint-disable @typescript-eslint/no-var-requires */

require('dotenv').config()

const { join } = require('path')
const PacktrackerPlugin = require('@packtracker/webpack-plugin')

const tsconfig = require('./tsconfig.json')
const tsPaths = tsconfig.compilerOptions.paths
const { locales, defaultLocale, localeDetection } = require('./i18n.json')

const nextTranslate = require('next-translate-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: Boolean(process.env.ANALYZE_BUNDLE),
  openAnalyzer: false,
})

const nextConfig = {
  i18n: { locales, defaultLocale, localeDetection },
  images: { disableStaticImages: true },
  productionBrowserSourceMaps: true,
  env: {
    /* FIREBASE */
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    DATABASE_URL: process.env.DATABASE_URL,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
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
  webpack: (config, { isServer }) => {
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

    config.module.rules.push(
      {
        test: /\.(jpg|jpeg|png|svg|gif|ico|webp|jp2|avif|mp3)$/,
        issuer: /\.[jt]sx?$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: 8192 } },
      },
      { test: /\.md$/, type: 'asset/source' },
    )

    if (!isServer && process.env.GITHUB_EVENT_PATH) {
      const event = require(process.env.GITHUB_EVENT_PATH)

      config.plugins.push(
        new PacktrackerPlugin({
          upload: true,
          fail_build: true,
          branch: event.ref.replace('refs/heads/', ''),
          author: event.head_commit.author.email,
          message: event.head_commit.message,
          commit: process.env.GITHUB_SHA,
          committed_at: parseInt(+new Date(event.head_commit.timestamp) / 1000),
          prior_commit: event.before,
        }),
      )
    }

    return config
  },
}

module.exports = withBundleAnalyzer(nextTranslate(nextConfig))
