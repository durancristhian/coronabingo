/* eslint-disable @typescript-eslint/no-var-requires */
const { environment } = require('./config')

// All consumers use the configuration selected by the owning runner.
module.exports = environment(JSON.parse(process.env.UI_TEST_CONFIG || 'null'))
