/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { createHash } = require('node:crypto')
const { spawnSync } = require('node:child_process')
const { toolEnvironment } = require('./tool-environment')

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

const rerun = 'Rerun bash scripts/setup-worktree.sh.'

function setupRecordPath(root) {
  return path.join(root, '.local', 'worktree-setup.json')
}

function sha256File(file) {
  if (!fs.existsSync(file)) return null
  return createHash('sha256')
    .update(fs.readFileSync(file))
    .digest('hex')
}

function setupInputs(root) {
  return {
    manifest: sha256File(path.join(root, 'package.json')),
    lockfile: sha256File(path.join(root, 'package-lock.json')),
    installed: sha256File(
      path.join(root, 'node_modules', '.package-lock.json'),
    ),
  }
}

function revision(root, ref) {
  const result = spawnSync(
    'git',
    ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`],
    { cwd: root, encoding: 'utf8' },
  )
  return result.status === 0 ? result.stdout.trim() : null
}

function launchedByT3(root, env = process.env) {
  const worktree = env.T3CODE_WORKTREE_PATH
  try {
    return (
      Boolean(worktree) && fs.realpathSync(worktree) === fs.realpathSync(root)
    )
  } catch {
    return false
  }
}

function writeSetupRecord(root, record) {
  const folder = path.dirname(setupRecordPath(root))
  fs.mkdirSync(folder, { recursive: true, mode: 0o700 })
  fs.chmodSync(folder, 0o700)
  const pending = `${setupRecordPath(root)}.pending`
  fs.writeFileSync(pending, `${JSON.stringify(record, null, 2)}\n`, {
    mode: 0o600,
  })
  fs.renameSync(pending, setupRecordPath(root))
}

function readSetupRecord(root) {
  try {
    return JSON.parse(fs.readFileSync(setupRecordPath(root), 'utf8'))
  } catch {
    return null
  }
}

function setupProblem(root, record, probes) {
  if (!record) return `Setup has not completed in this worktree. ${rerun}`
  try {
    validateRuntime(root, probes.nodeVersion, probes.npmVersion)
  } catch (error) {
    return error.message
  }
  const inputs = setupInputs(root)
  if (
    inputs.manifest !== record.manifest ||
    inputs.lockfile !== record.lockfile
  ) {
    return `package.json or package-lock.json changed since setup. ${rerun}`
  }
  if (!inputs.installed || inputs.installed !== record.installed) {
    return `node_modules no longer matches package-lock.json. ${rerun}`
  }
  const environment = fs.lstatSync(path.join(root, '.env'), {
    throwIfNoEntry: false,
  })
  if (!environment?.isFile() || environment.isSymbolicLink()) {
    return `.env is missing or is not a regular file. ${rerun}`
  }
  if (probes.javaMajor < 21) {
    return 'Java 21+ is required. See docs/development.md for installation.'
  }
  if (!probes.chromiumReady) return `Playwright Chromium is missing. ${rerun}`
  if (!probes.emulatorReady) {
    return `The Firestore emulator download is missing or corrupt. ${rerun}`
  }
  return null
}

function baseSummary(root, { head, originMain }) {
  const short = value => value?.slice(0, 7) ?? 'no commit'
  if (!originMain) {
    return `Setup ran at ${short(head)}; origin/main was unavailable.`
  }
  if (head === originMain) {
    return `Setup ran at ${short(head)}, the fetched origin/main.`
  }
  const behind = spawnSync(
    'git',
    ['rev-list', '--count', `${head}..${originMain}`],
    { cwd: root, encoding: 'utf8' },
  )
  const count = behind.status === 0 ? Number(behind.stdout.trim()) : NaN
  if (count === 0) {
    return `Setup ran at ${short(
      head,
    )}, which includes the fetched origin/main ${short(originMain)}.`
  }
  return `Setup ran at ${short(head)}, ${
    Number.isNaN(count) ? 'an unknown number of' : count
  } commits behind the fetched origin/main ${short(originMain)}.`
}

function javaMajor(env) {
  const java = spawnSync('java', ['-version'], { env, encoding: 'utf8' })
  const version = `${java.stdout || ''}${java.stderr || ''}`.match(
    /version "(\d+)/,
  )
  return java.status === 0 && version ? Number(version[1]) : 0
}

function emulatorArtifact(env) {
  const metadata = require('firebase-tools/lib/emulator/downloadableEmulatorInfo.json')
    .firestore
  const file = path.join(
    env.FIREBASE_EMULATORS_PATH ||
      path.join(os.homedir(), '.cache/firebase/emulators'),
    metadata.downloadPathRelativeToCacheDir,
  )
  return { metadata, file }
}

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
  fs.rmSync(setupRecordPath(root), { force: true })
  const env = {
    ...toolEnvironment(root),
    PLAYWRIGHT_SKIP_BROWSER_GC: '1',
    npm_config_update_notifier: 'false',
  }
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
  const npmVersion = run('npm', ['--version'], true)
  validateRuntime(root, process.versions.node, npmVersion)
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
  if (javaMajor(env) < 21) {
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
  const chromiumVersion = browser.version()
  console.log(`Chromium ${chromiumVersion} launched successfully.`)
  await browser.close()
  const { metadata, file: emulatorFile } = emulatorArtifact(env)
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
  writeSetupRecord(root, {
    completedAt: new Date().toISOString(),
    seconds: Number(((Date.now() - started) / 1000).toFixed(1)),
    launchedBy: launchedByT3(root) ? 'T3' : 'manual',
    head: revision(root, 'HEAD'),
    originMain: revision(root, 'refs/remotes/origin/main'),
    node: process.versions.node,
    npm: npmVersion,
    ...setupInputs(root),
    chromium: chromiumVersion,
    firestoreEmulator: metadata.version,
  })
  console.log(
    `Tooling ready in ${((Date.now() - started) / 1000).toFixed(
      1,
    )}s. No application or emulator services started.`,
  )
}

async function check() {
  const root = path.resolve(__dirname, '..')
  const record = readSetupRecord(root)
  const env = toolEnvironment(root)
  const npm = spawnSync('npm', ['--version'], {
    cwd: root,
    env,
    encoding: 'utf8',
  })
  let chromiumReady = false
  let emulatorReady = false
  if (record) {
    try {
      const { chromium } = require('@playwright/test')
      chromiumReady = fs.existsSync(chromium.executablePath())
      const { metadata, file } = emulatorArtifact(env)
      emulatorReady = await verifyArtifact(file, metadata)
    } catch {
      chromiumReady = false
    }
  }
  const problem = setupProblem(root, record, {
    nodeVersion: process.versions.node,
    npmVersion: npm.stdout?.trim(),
    javaMajor: record ? javaMajor(env) : 0,
    chromiumReady,
    emulatorReady,
  })
  if (problem) throw new Error(problem)
  const head = revision(root, 'HEAD')
  console.log(
    [
      `Setup completed ${record.completedAt} by ${
        record.launchedBy === 'T3'
          ? 'T3 in the worktree terminal'
          : 'a manual run'
      } in ${record.seconds}s.`,
      baseSummary(root, record),
      ...(head === record.head
        ? []
        : [`HEAD is now ${head?.slice(0, 7)}; setup inputs still match.`]),
      `Node ${
        process.versions.node
      } and npm ${npm.stdout.trim()}; node_modules matches package-lock.json.`,
      `Java, Chromium ${record.chromium} and Firestore emulator ${record.firestoreEmulator} verified.`,
    ].join('\n'),
  )
}

if (require.main === module) {
  const task =
    process.argv[2] === 'check' && process.argv.length === 3 ? check : main
  task().catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
}

module.exports = {
  launchedByT3,
  preserveEnvironment,
  readSetupRecord,
  setupInputs,
  setupProblem,
  validateRuntime,
  verifyArtifact,
  writeSetupRecord,
}
