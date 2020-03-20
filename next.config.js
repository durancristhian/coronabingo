const withImages = require('next-images')
const { join } = require('path');
const tsconfig = require('./tsconfig.json');

const tsPaths = tsconfig.compilerOptions.paths;

module.exports = withImages({
  env: {
    spreadsheetID: '1lJCLVoQKilrNWuxl04GIg-r2My-bNVaxS1uwZCkC1Mw',
    worksheetName: 'cartones'
  },
  webpack(config) {
    /*
      Convert tsconfig path
      { '@components/*': [ './src/components/*' ] }

      To webpack aliases
      { config.resolve.alias['@components'] = path.join(__dirname, './src/components') }
    */
    Object.keys(tsPaths).forEach(key => {
      const newKey = key.replace('/*', '');
      const value = tsPaths[key][0].replace('/*', '');

      config.resolve.alias[newKey] = join(__dirname, value);
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  }
});
