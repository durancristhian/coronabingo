/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')

const root = path.resolve(__dirname, '../..')

function validate(t, overlap, metadata = { ticketCount: 2, maxPlayers: 1 }) {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'coronabingo-cards-'))
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }))
  fs.mkdirSync(path.join(fixture, 'scripts'))
  fs.mkdirSync(path.join(fixture, 'public'))
  // Run an unchanged copy of the real entrypoint without touching the catalog.
  const script = path.join(fixture, 'scripts/validate-tickets.ts')
  fs.copyFileSync(path.join(root, 'scripts/validate-tickets.ts'), script)
  const first = Array.from({ length: 15 }, (_, i) => i + 1)
  const second = first
    .slice(0, overlap)
    .concat(Array.from({ length: 15 - overlap }, (_, i) => i + 16))
  fs.writeFileSync(
    path.join(fixture, 'public/tickets.json'),
    JSON.stringify([first, second]),
  )
  fs.writeFileSync(
    path.join(fixture, 'public/tickets-metadata.json'),
    JSON.stringify(metadata),
  )
  const result = spawnSync(
    process.execPath,
    [
      require.resolve('ts-node/dist/bin'),
      '--project',
      path.join(root, 'tsconfig.scripts.json'),
      script,
    ],
    { cwd: fixture, encoding: 'utf8', timeout: 30_000 },
  )
  assert.ifError(result.error)
  assert.equal(result.signal, null)
  return result
}

test('card validator accepts overlap at the allowed boundary', t => {
  const result = validate(t, 10)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /There are no tickets/)
  assert.equal(result.stderr, '')
})

test('card validator fails for excessive overlap and preserves diagnostics', t => {
  const result = validate(t, 11)
  assert.match(result.stderr, /AssertionError/)
  assert.match(result.stdout, /Tickets with problems/)
  assert.match(result.stdout, /"0":\s*\[\s*"1"\s*\]/)
  assert.match(result.stdout, /"1":\s*\[\s*"0"\s*\]/)
  assert.equal(result.status, 1)
})

test('card validator still fails for inconsistent metadata', t => {
  const result = validate(t, 10, { ticketCount: 4, maxPlayers: 2 })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Ticket metadata count must match the catalog/)
  assert.doesNotMatch(result.stdout, /There are no tickets/)
})
