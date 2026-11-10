/* eslint-disable @typescript-eslint/no-var-requires */
const { environment } = require('./config')

module.exports = environment(JSON.parse(process.env.UI_TEST_CONFIG || 'null'))
