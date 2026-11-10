/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { createHash } = require('node:crypto')
const { spawnSync } = require('node:child_process')
const { toolEnvironment } = require('./tool-environment')

function preserveEnvironment(root, source) {
  const destination = path.join(root, '.env')
  const existing = fs.lstatSync(destination, { throwIfNoEntry: false })
  if (existing) {
    if (!existing.isFile() || existing.isSymbolicLink()) {
      throw new Error('.env must be a regular file, not a symlink.')
    }
    return false
  }
  const stat = fs.lstatSync(source, { throwIfNoEntry: false })
  if (!stat?.isFile() || stat.isSymbolicLink()) {
    throw new Error('Approved source .env is missing or is not a regular file.')
  }
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(destination, 0o600)
  return true
}

function validateRuntime(root, nodeVersion, npmVersion) {
  const expectedNode = fs.readFileSync(path.join(root, '.nvmrc'), 'utf8').trim()
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json')))
  const expectedNpm = manifest.packageManager.replace(/^npm@/, '')
  if (nodeVersion !== expectedNode || npmVersion !== expectedNpm) {
    throw new Error(
      `Use Node ${expectedNode} and npm ${expectedNpm} before setup.`,
    )
  }
}

async function verifyArtifact(file, metadata) {
  const stat = fs.statSync(file, { throwIfNoEntry: false })
  if (!stat?.isFile() || stat.size !== metadata.expectedSize) return false
  const hash = createHash('sha256')
  for await (const chunk of fs.createReadStream(file)) hash.update(chunk)
  return hash.digest('hex') === metadata.expectedChecksumSHA256
}

async function main() {
  if (process.argv.length > 2) throw new Error('Setup takes no arguments.')
  if (process.platform === 'win32') {
    throw new Error('Run setup in WSL, Linux or macOS.')
  }
  const root = path.resolve(__dirname, '..')
  if (fs.existsSync(path.join(root, '.ui-tests-lock'))) {
    throw new Error('Stop the owned UI runner before installing dependencies.')
  }
  const started = Date.now()
  const env = { ...toolEnvironment(root), PLAYWRIGHT_SKIP_BROWSER_GC: '1' }
  function run(command, args, capture = false) {
    const result = spawnSync(command, args, {
      cwd: root,
      env,
      stdio: capture ? 'pipe' : 'inherit',
      encoding: 'utf8',
    })
    if (result.status !== 0) throw new Error(`${command} failed during setup.`)
    return result.stdout?.trim()
  }
  validateRuntime(root, process.versions.node, run('npm', ['--version'], true))
  const common = run('git', ['rev-parse', '--git-common-dir'], true)
  const primary = path.resolve(root, common, '..')
  const source = path.join(primary, '.env')
  if (!fs.existsSync(path.join(root, '.env')) && root === primary) {
    preserveEnvironment(root, path.join(root, '.env.template'))
    console.log(
      'Created .env from the value-free template; obtain hosted configuration from its owner if needed.',
    )
  } else {
    preserveEnvironment(root, source)
  }
  console.log(
    'Environment preserved. Copying it does not isolate hosted services.',
  )
  run('npm', ['ci'])
  const java = spawnSync('java', ['-version'], { env, encoding: 'utf8' })
  const version = `${java.stdout || ''}${java.stderr || ''}`.match(
    /version "(\d+)/,
  )
  if (java.status !== 0 || !version || Number(version[1]) < 21) {
    throw new Error(
      'Java 21+ is required. See docs/development.md for installation.',
    )
  }
  run(process.execPath, [
    require.resolve('@playwright/test/cli'),
    'install',
    'chromium',
  ])
  const { chromium } = require('@playwright/test')
  const browser = await chromium.launch()
  console.log(`Chromium ${browser.version()} launched successfully.`)
  await browser.close()
  const metadata = require('firebase-tools/lib/emulator/downloadableEmulatorInfo.json')
    .firestore
  const emulatorFile = path.join(
    env.FIREBASE_EMULATORS_PATH ||
      path.join(os.homedir(), '.cache/firebase/emulators'),
    metadata.downloadPathRelativeToCacheDir,
  )
  if (!(await verifyArtifact(emulatorFile, metadata))) {
    run(process.execPath, [
      require.resolve('firebase-tools/lib/bin/firebase'),
      'setup:emulators:firestore',
      '--non-interactive',
    ])
  }
  if (!(await verifyArtifact(emulatorFile, metadata))) {
    throw new Error('Firestore emulator checksum verification failed.')
  }
  console.log(`Firestore emulator ${metadata.version} checksum verified.`)
  console.log(
    `Tooling ready in ${((Date.now() - started) / 1000).toFixed(
      1,
    )}s. No application or emulator services started.`,
  )
}

if (require.main === module) {
  main().catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
}

module.exports = { preserveEnvironment, validateRuntime, verifyArtifact }
