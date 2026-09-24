/* eslint-disable @typescript-eslint/no-var-requires */
const { spawn, spawnSync } = require('node:child_process')
const fs = require('node:fs/promises')
const net = require('node:net')
const path = require('node:path')
const { setTimeout: delay } = require('node:timers/promises')
const {
  appEnv,
  appPort,
  baseURL,
  distDir,
  firestorePort,
  projectId,
} = require('../tests/ui/environment')
const { emulators } = require('../tests/ui/firebase.json')

const root = path.resolve(__dirname, '..')
const lock = path.join(root, '.ui-tests-lock')
const args = process.argv.slice(2)
const buildOnly = args.includes('--build-only')
const production = buildOnly || args.includes('--production')
const skipBuild = args.includes('--skip-build')
const playwrightArgs = args.filter(
  arg => !['--production', '--build-only', '--skip-build'].includes(arg),
)
const env = {
  ...process.env,
  ...appEnv,
  UI_TEST_RUNNER: '1',
  UI_TEST_MODE: production ? 'production' : 'development',
  NEXT_TELEMETRY_DISABLED: '1',
  // The isolated configstore has no Firebase login or telemetry opt-in.
  FIREBASE_TOKEN: '',
  FIRESTORE_EMULATOR_VERSION: '',
  GOOGLE_APPLICATION_CREDENTIALS: '',
  GCLOUD_PROJECT: appEnv.PROJECT_ID,
  GOOGLE_CLOUD_PROJECT: appEnv.PROJECT_ID,
  XDG_CONFIG_HOME: path.join(root, '.ui-tests-config'),
}
// Homebrew's keg-only JDK does not replace macOS's /usr/bin/java stub.
if (!env.JAVA_HOME && process.platform === 'darwin') {
  for (const prefix of ['/opt/homebrew', '/usr/local']) {
    const javaHome = `${prefix}/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home`
    if (require('node:fs').existsSync(`${javaHome}/bin/java`)) {
      env.JAVA_HOME = javaHome
      break
    }
  }
}
if (env.JAVA_HOME) env.PATH = `${env.JAVA_HOME}/bin${path.delimiter}${env.PATH}`

const ownedProcesses = new Set()
const interrupt = new AbortController()
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () =>
    interrupt.abort(new Error(`UI tests interrupted by ${signal}`)),
  )
}

async function interruptible(promise) {
  interrupt.signal.throwIfAborted()
  let onAbort
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        onAbort = () => reject(interrupt.signal.reason)
        interrupt.signal.addEventListener('abort', onAbort, { once: true })
      }),
    ])
  } finally {
    interrupt.signal.removeEventListener('abort', onAbort)
  }
}

function start(command, commandArgs, options = {}) {
  interrupt.signal.throwIfAborted()
  const child = spawn(command, commandArgs, {
    cwd: options.cwd || root,
    env,
    stdio: 'inherit',
    detached: true,
  })
  const owned = { child, signal: options.signal || 'SIGTERM', result: null }
  owned.done = new Promise(resolve => {
    const finish = result => {
      owned.result = result
      resolve(result)
    }
    child.once('error', error => finish({ error }))
    child.once('exit', (code, signal) => finish({ code, signal }))
  })
  ownedProcesses.add(owned)
  console.log(`Started ${options.name || command}: PID/group ${child.pid}`)
  return owned
}

function signalGroup(owned, signal) {
  if (!owned.child.pid) return
  try {
    process.kill(-owned.child.pid, signal)
  } catch (error) {
    if (error.code !== 'ESRCH') throw error
  }
}

async function stop(owned) {
  signalGroup(owned, owned.signal)
  let timer
  try {
    const exited = await Promise.race([
      owned.done.then(() => true),
      new Promise(resolve => {
        timer = setTimeout(() => resolve(false), 10_000)
      }),
    ])
    // Also remove descendants left by a command whose coordinator exited.
    signalGroup(owned, 'SIGKILL')
    if (!exited) await owned.done
  } finally {
    clearTimeout(timer)
    ownedProcesses.delete(owned)
  }
}

async function run(command, commandArgs, options = {}) {
  const owned = start(command, commandArgs, options)
  try {
    const result = await interruptible(owned.done)
    if (result.error) throw result.error
    if (result.code !== 0) {
      throw new Error(`${command} exited with ${result.signal || result.code}`)
    }
  } finally {
    await stop(owned)
  }
}

async function waitForService(owned, url) {
  const deadline = Date.now() + 120_000
  while (Date.now() < deadline) {
    interrupt.signal.throwIfAborted()
    if (owned.result)
      throw new Error(`Service at ${url} exited before becoming ready`)
    const ready = await interruptible(
      fetch(url, { signal: AbortSignal.timeout(1000) })
        .then(async response => {
          await response.body?.cancel()
          return response.ok
        })
        .catch(() => false),
    )
    if (ready) return
    await delay(200, undefined, { signal: interrupt.signal })
  }
  throw new Error(`Service at ${url} did not become ready within 120 seconds`)
}

async function checkPort(port) {
  await new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once('error', () => {
      reject(
        new Error(
          `Port ${port} is occupied. Stop its owner or use another worktree after that run finishes.`,
        ),
      )
    })
    server.listen(port, '127.0.0.1', () => server.close(resolve))
  })
}

async function main() {
  if (process.platform === 'win32') {
    throw new Error('Run UI tests in WSL, Linux or macOS.')
  }
  if (skipBuild && (!production || buildOnly)) {
    throw new Error('--skip-build requires --production without --build-only')
  }
  await fs.mkdir(lock).catch(() => {
    throw new Error(
      'UI test lock exists. See README before removing .ui-tests-lock.',
    )
  })
  const started = Date.now()
  const nextEnvPath = path.join(root, 'next-env.d.ts')
  let previousNextEnv
  try {
    previousNextEnv = await fs.readFile(nextEnvPath, 'utf8').catch(error => {
      if (error.code !== 'ENOENT') throw error
      return null
    })
    await fs.writeFile(
      path.join(lock, 'owner.json'),
      JSON.stringify({ pid: process.pid, root }),
    )
    if (!buildOnly) {
      for (const port of [
        appPort,
        emulators.firestore.port,
        emulators.firestore.websocketPort,
        emulators.hub.port,
        emulators.logging.port,
      ]) {
        await checkPort(port)
      }
      const java = spawnSync('java', ['-version'], { env, encoding: 'utf8' })
      const version = `${java.stdout || ''}${java.stderr || ''}`.match(
        /version "(\d+)/,
      )
      if (java.status !== 0 || !version || Number(version[1]) < 21) {
        throw new Error('Java 21+ is required. See README UI test setup.')
      }
    }
    const marker = path.join(root, distDir, 'ui-test-build.json')
    if (production && !skipBuild) {
      await fs.rm(marker, { force: true })
      await run('npm', ['run', 'build'])
      const buildId = await fs.readFile(
        path.join(root, distDir, 'BUILD_ID'),
        'utf8',
      )
      await fs.writeFile(marker, JSON.stringify({ appEnv, buildId }))
    }
    if (buildOnly) return
    if (skipBuild) {
      const saved = JSON.parse(await fs.readFile(marker, 'utf8'))
      const buildId = await fs.readFile(
        path.join(root, distDir, 'BUILD_ID'),
        'utf8',
      )
      if (JSON.stringify(saved) !== JSON.stringify({ appEnv, buildId })) {
        throw new Error(
          'Test build configuration changed. Run npm run ui-tests:build.',
        )
      }
    }
    console.log(
      `UI tests: ${env.UI_TEST_MODE}, ${appEnv.URL}, ${appEnv.PROJECT_ID}, runner PID ${process.pid}, ${root}`,
    )
    const firestore = start(
      process.execPath,
      [
        require.resolve('firebase-tools/lib/bin/firebase'),
        'emulators:start',
        '--only',
        'firestore',
        '--project',
        projectId,
        '--config',
        'firebase.json',
        '--non-interactive',
      ],
      { cwd: path.join(root, 'tests/ui'), signal: 'SIGINT', name: 'Firestore' },
    )
    await waitForService(
      firestore,
      `http://127.0.0.1:${firestorePort}/v1/projects/${projectId}/databases/(default)/documents/rooms`,
    )
    const next = start(
      'npm',
      [
        'run',
        production ? 'start' : 'dev',
        '--',
        '--hostname',
        '127.0.0.1',
        '--port',
        String(appPort),
      ],
      { name: 'Next.js' },
    )
    await waitForService(next, baseURL)
    await fs.writeFile(
      path.join(lock, 'owner.json'),
      JSON.stringify({
        pid: process.pid,
        root,
        services: [...ownedProcesses].map(owned => ({
          pid: owned.child.pid,
          processGroup: owned.child.pid,
        })),
      }),
    )
    await run(
      process.execPath,
      [require.resolve('@playwright/test/cli'), 'test', ...playwrightArgs],
      { signal: 'SIGINT', name: 'Playwright' },
    )
  } finally {
    for (const owned of [...ownedProcesses].reverse()) await stop(owned)
    // Next writes this shared declaration even when distDir is separate.
    // Restore it only if it still points at our build, not another server's.
    const currentNextEnv = await fs
      .readFile(nextEnvPath, 'utf8')
      .catch(() => '')
    if (
      previousNextEnv !== undefined &&
      currentNextEnv.includes(`./${distDir}/`)
    ) {
      if (previousNextEnv === null) await fs.rm(nextEnvPath, { force: true })
      else await fs.writeFile(nextEnvPath, previousNextEnv)
    }
    await fs.rm(lock, { recursive: true, force: true })
    console.log(
      `UI test command finished in ${((Date.now() - started) / 1000).toFixed(
        1,
      )}s`,
    )
  }
}

main().catch(error => {
  console.error(error.message)
  process.exitCode = interrupt.signal.aborted ? 130 : 1
})
