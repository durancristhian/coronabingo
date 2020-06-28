/* eslint-disable @typescript-eslint/no-var-requires */

require('dotenv').config()

const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const { join } = require('path')
const PacktrackerPlugin = require('@packtracker/webpack-plugin')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const withSourceMaps = require('@zeit/next-source-maps')()

const tsconfig = require('./tsconfig.json')
const tsPaths = tsconfig.compilerOptions.paths

const nextConfig = {
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
      test: /\.mp3$/,
      loader: 'url-loader',
    })

    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })

    if (process.env.GITHUB_EVENT_PATH) {
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

module.exports = withPlugins(
  [
    [withImages],
    [withSourceMaps],
    [
      withBundleAnalyzer,
      {
        analyzeBrowser: process.env.ANALYZE_BUNDLE,
        analyzeServer: process.env.ANALYZE_BUNDLE,
        bundleAnalyzerConfig: {
          browser: {
            analyzerMode: 'static',
            reportFilename: 'bundle-analyzer/client.html',
          },
          server: {
            analyzerMode: 'static',
            reportFilename: 'bundle-analyzer/server.html',
          },
        },
      },
    ],
  ],
  nextConfig,
)
