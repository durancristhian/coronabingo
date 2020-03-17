module.exports = {
  env: {
    spreadsheetID: '1lJCLVoQKilrNWuxl04GIg-r2My-bNVaxS1uwZCkC1Mw',
    worksheetName: 'cartones'
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  }
}
