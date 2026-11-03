/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')
const {
  preserveEnvironment,
  validateRuntime,
  verifyArtifact,
} = require('../../scripts/worktree-setup')

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'coronabingo-setup-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  return root
}

test('copies env once with private permissions and preserves subsequent local edits', t => {
  const root = fixture(t)
  const source = path.join(root, 'approved-env')
  const destination = path.join(root, '.env')
  fs.writeFileSync(source, 'PRIVATE=source\n')
  assert.equal(preserveEnvironment(root, source), true)
  assert.equal(fs.statSync(destination).mode & 0o777, 0o600)
  fs.writeFileSync(destination, 'PRIVATE=local\n')
  fs.unlinkSync(source)
  assert.equal(preserveEnvironment(root, source), false)
  assert.equal(fs.readFileSync(destination, 'utf8'), 'PRIVATE=local\n')
})

test('refuses missing and symlinked sources without creating a destination', t => {
  const root = fixture(t)
  const source = path.join(root, 'approved-env')
  assert.throws(() => preserveEnvironment(root, source), /source .env/)
  fs.symlinkSync(path.join(root, 'absent'), source)
  assert.throws(() => preserveEnvironment(root, source), /source .env/)
  assert.equal(fs.existsSync(path.join(root, '.env')), false)
})

test('refuses destination symlinks including dangling links', t => {
  const root = fixture(t)
  fs.symlinkSync(path.join(root, 'absent'), path.join(root, '.env'))
  assert.throws(() => preserveEnvironment(root, 'unused'), /regular file/)
})

test('rejects runtime drift against repository runtime files', t => {
  const root = fixture(t)
  fs.writeFileSync(path.join(root, '.nvmrc'), '24.21.0\n')
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({ packageManager: 'npm@11.19.0' }),
  )
  validateRuntime(root, '24.21.0', '11.19.0')
  assert.throws(() => validateRuntime(root, '26.0.0', '11.19.0'), /Use Node/)
  assert.throws(() => validateRuntime(root, '24.21.0', '12.0.0'), /Use Node/)
})

test('accepts the expected emulator artifact and rejects missing, corrupt or stale files', async t => {
  const root = fixture(t)
  const file = path.join(root, 'emulator.jar')
  const metadata = {
    expectedSize: 3,
    expectedChecksumSHA256:
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  }
  assert.equal(await verifyArtifact(file, metadata), false)
  fs.writeFileSync(file, 'abc')
  assert.equal(await verifyArtifact(file, metadata), true)
  fs.writeFileSync(file, 'xyz')
  assert.equal(await verifyArtifact(file, metadata), false)
  fs.writeFileSync(file, 'different-version')
  assert.equal(await verifyArtifact(file, metadata), false)
})
