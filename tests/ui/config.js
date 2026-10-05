const portNames = ['app', 'firestore', 'websocket', 'hub', 'logging']
const distDir = '.next-ui-tests'

function validateConfig(config) {
  if (
    !config ||
    typeof config.id !== 'string' ||
    !/^[a-f0-9]{32}$/.test(config.id) ||
    !config.ports ||
    portNames.some(name => {
      const port = config.ports[name]
      return !Number.isInteger(port) || port < 1024 || port > 65535
    }) ||
    new Set(portNames.map(name => config.ports[name])).size !== portNames.length
  ) {
    throw new Error('Invalid UI test configuration. Use npm run ui-tests.')
  }
  return config
}

function environment(config) {
  validateConfig(config)
  const projectId = `demo-coronabingo-ui-${config.id.slice(0, 8)}`
  const appPort = config.ports.app
  const firestorePort = config.ports.firestore
  const baseURL = `http://127.0.0.1:${appPort}`
  const appEnv = {
    UI_TESTS: '1',
    UI_TEST_CONFIG: JSON.stringify(config),
    FIRESTORE_EMULATOR_HOST: `127.0.0.1:${firestorePort}`,
    API_KEY: 'demo-api-key',
    DATABASE_URL: '',
    PROJECT_ID: projectId,
    MESSAGING_SENDER_ID: '123456789',
    APP_ID: '1:123456789:web:demo',
    GA_TRACKING_ID: 'G-TEST123',
    SENTRY_DSN: '',
    URL: baseURL,
  }
  return { appEnv, appPort, baseURL, distDir, firestorePort, projectId }
}

module.exports = { portNames, distDir, validateConfig, environment }
