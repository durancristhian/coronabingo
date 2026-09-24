// Public, disposable configuration. Never use a hosted project in this suite.
const projectId = 'demo-coronabingo-ui'
const appPort = 3187
const firestorePort = 8187
const baseURL = `http://127.0.0.1:${appPort}`
const distDir = '.next-ui-tests'
const appEnv = {
  UI_TESTS: '1',
  FIRESTORE_EMULATOR_HOST: `127.0.0.1:${firestorePort}`,
  API_KEY: 'demo-api-key',
  DATABASE_URL: '',
  PROJECT_ID: projectId,
  MESSAGING_SENDER_ID: '123456789',
  APP_ID: '1:123456789:web:demo',
  MEASUREMENT_ID: '',
  GA_TRACKING_ID: '',
  SENTRY_DSN: '',
  URL: baseURL,
}

module.exports = { appEnv, appPort, baseURL, distDir, firestorePort, projectId }
