/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('node:assert/strict')
const path = require('node:path')
const { test } = require('node:test')
const { toolEnvironment } = require('../../scripts/tool-environment')

test('tooling removes inherited credentials and preserves explicit Java and unrelated settings', () => {
  const inherited = {
    FIREBASE_TOKEN: 'private-token',
    GOOGLE_APPLICATION_CREDENTIALS: '/private/credentials.json',
    FIRESTORE_EMULATOR_VERSION: 'old-version',
    XDG_CONFIG_HOME: '/private/firebase-login',
    NEXT_TELEMETRY_DISABLED: '0',
    JAVA_HOME: '/chosen/java',
    PATH: '/existing/bin',
    CUSTOM_TOOL_SETTING: 'preserved',
  }
  const original = { ...inherited }
  const env = toolEnvironment('/task/checkout', inherited)
  assert.equal(env.FIREBASE_TOKEN, '')
  assert.equal(env.GOOGLE_APPLICATION_CREDENTIALS, '')
  assert.equal(env.FIRESTORE_EMULATOR_VERSION, '')
  assert.equal(
    env.XDG_CONFIG_HOME,
    path.join('/task/checkout', '.ui-tests-config'),
  )
  assert.equal(env.NEXT_TELEMETRY_DISABLED, '1')
  assert.equal(env.JAVA_HOME, '/chosen/java')
  assert.equal(env.PATH, `/chosen/java/bin${path.delimiter}/existing/bin`)
  assert.equal(env.CUSTOM_TOOL_SETTING, 'preserved')
  assert.deepEqual(inherited, original)
})
