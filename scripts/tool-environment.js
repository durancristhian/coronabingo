/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs')
const path = require('node:path')

function toolEnvironment(root, inherited = process.env) {
  const env = {
    ...inherited,
    NEXT_TELEMETRY_DISABLED: '1',
    FIREBASE_TOKEN: '',
    FIRESTORE_EMULATOR_VERSION: '',
    GOOGLE_APPLICATION_CREDENTIALS: '',
    // The isolated configstore has no Firebase login or telemetry opt-in.
    XDG_CONFIG_HOME: path.join(root, '.ui-tests-config'),
  }
  // Homebrew's keg-only JDK does not replace macOS's /usr/bin/java stub.
  if (!env.JAVA_HOME && process.platform === 'darwin') {
    for (const prefix of ['/opt/homebrew', '/usr/local']) {
      const javaHome = `${prefix}/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home`
      if (fs.existsSync(`${javaHome}/bin/java`)) {
        env.JAVA_HOME = javaHome
        break
      }
    }
  }
  if (env.JAVA_HOME)
    env.PATH = `${env.JAVA_HOME}/bin${path.delimiter}${env.PATH}`
  return env
}

module.exports = { toolEnvironment }
