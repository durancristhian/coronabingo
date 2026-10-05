/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('node:assert/strict')
const http = require('node:http')
const { test } = require('node:test')
const { waitForService } = require('../../scripts/ui-test-runtime')

async function serve(t, handler) {
  const server = http.createServer(handler)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => server.close(resolve)))
  return `http://127.0.0.1:${server.address().port}`
}

test('rejects an HTTP 200 from another worktree during startup', async t => {
  const url = await serve(t, (_, response) => response.end('foreign app'))
  await assert.rejects(
    waitForService({ result: null }, url, {
      signal: new AbortController().signal,
      identity: 'expected-run',
    }),
    /identity/,
  )
})

test('rejects an owned process exiting while the readiness response is pending', async t => {
  const owned = { result: null }
  const url = await serve(t, (_, response) => {
    owned.result = { code: 1 }
    response.setHeader('x-coronabingo-ui-run', 'expected-run')
    response.end('ready')
  })
  await assert.rejects(
    waitForService(owned, url, {
      signal: new AbortController().signal,
      identity: 'expected-run',
    }),
    /exited/,
  )
})

test('accepts only the expected server identity', async t => {
  const url = await serve(t, (_, response) => {
    response.setHeader('x-coronabingo-ui-run', 'expected-run')
    response.end('ready')
  })
  await waitForService({ result: null }, url, {
    signal: new AbortController().signal,
    identity: 'expected-run',
  })
})

test('parallel reservations have disjoint ports and releasing one preserves the other', async t => {
  const { reservePorts } = require('../../scripts/ui-test-runtime')
  const first = await reservePorts()
  t.after(() => first.release())
  const second = await reservePorts()
  t.after(() => second.release())
  assert.equal(
    new Set([...Object.values(first.ports), ...Object.values(second.ports)])
      .size,
    10,
  )
  await first.release()
  const replacement = await reservePorts(first.ports)
  t.after(() => replacement.release())
  await assert.rejects(reservePorts(second.ports), /Cannot reserve/)
})

test('a partial reservation failure releases acquired ports without stopping the blocker', async t => {
  const { reservePorts } = require('../../scripts/ui-test-runtime')
  const first = await reservePorts()
  t.after(() => first.release())
  const ports = { ...first.ports }
  await first.release(['app', 'websocket', 'hub', 'logging'])
  await assert.rejects(reservePorts(ports), /Cannot reserve/)
  // The failed attempt held app before encountering the occupied Firestore port.
  await first.release()
  const recovered = await reservePorts(ports)
  t.after(() => recovered.release())
})

test('unexpected service exit aborts the shared run signal', async () => {
  const { supervise } = require('../../scripts/ui-test-runtime')
  const controller = new AbortController()
  let exit
  const owned = {
    done: new Promise(resolve => {
      exit = resolve
    }),
  }
  supervise(owned, controller, 'Firestore')
  const aborted = new Promise(resolve =>
    controller.signal.addEventListener('abort', resolve, { once: true }),
  )
  exit({ code: 1 })
  await aborted
  assert.match(
    controller.signal.reason.message,
    /Firestore exited unexpectedly/,
  )
})

test('intentional shutdown does not report a failed service', async () => {
  const { supervise } = require('../../scripts/ui-test-runtime')
  const controller = new AbortController()
  supervise(
    { done: Promise.resolve({ signal: 'SIGTERM' }), stopping: true },
    controller,
    'Next.js',
  )
  await Promise.resolve()
  assert.equal(controller.signal.aborted, false)
})

test('interrupt cancels a pending readiness request promptly', async t => {
  const controller = new AbortController()
  const url = await serve(t, (_, response) => {
    controller.abort(new Error('test interrupt'))
    response.end()
  })
  await assert.rejects(
    waitForService({ result: null }, url, { signal: controller.signal }),
    /test interrupt/,
  )
})

test('configuration keeps targets local and rejects invalid or overlapping ports', () => {
  const { environment, validateConfig } = require('../ui/config')
  const config = {
    id: 'a'.repeat(32),
    ports: {
      app: 31001,
      firestore: 31002,
      websocket: 31003,
      hub: 31004,
      logging: 31005,
    },
  }
  const { appEnv } = environment(config)
  assert.equal(appEnv.PROJECT_ID, 'demo-coronabingo-ui-aaaaaaaa')
  assert.equal(appEnv.FIRESTORE_EMULATOR_HOST, '127.0.0.1:31002')
  for (const value of [
    null,
    { ...config, id: 'hosted-project' },
    { ...config, ports: { ...config.ports, app: 80 } },
    { ...config, ports: { ...config.ports, app: 31002 } },
  ]) {
    assert.throws(() => validateConfig(value), /Invalid UI test configuration/)
  }
})
