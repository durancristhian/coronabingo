/* eslint-disable @typescript-eslint/no-var-requires */
const net = require('node:net')
const { setTimeout: delay } = require('node:timers/promises')
const { portNames } = require('../tests/ui/config')

async function reservePorts(requested = {}) {
  const servers = new Map()
  const ports = {}
  const release = async (names = [...servers.keys()]) => {
    for (const name of names) {
      const server = servers.get(name)
      if (!server) continue
      await new Promise(resolve => server.close(resolve))
      servers.delete(name)
    }
  }
  try {
    for (const name of portNames) {
      const server = net.createServer(socket => socket.destroy())
      await new Promise((resolve, reject) => {
        server.once('error', reject)
        server.listen(requested[name] || 0, '127.0.0.1', resolve)
      })
      servers.set(name, server)
      ports[name] = server.address().port
    }
    return { ports, release }
  } catch (error) {
    await release()
    throw new Error(
      `Cannot reserve UI test ports (${error.code}). For a saved build, run npm run ui-tests:production to select new ports and rebuild.`,
    )
  }
}

function supervise(owned, controller, name) {
  owned.done.then(result => {
    if (!owned.stopping) {
      controller.abort(
        new Error(
          `${name} exited unexpectedly (${result.code ??
            result.signal ??
            result.error})`,
        ),
      )
    }
  })
}

async function waitForService(owned, url, { signal, identity }) {
  const deadline = Date.now() + 120_000
  while (Date.now() < deadline) {
    signal.throwIfAborted()
    if (owned.result)
      throw new Error(`Service at ${url} exited before becoming ready`)
    const response = await fetch(url, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(1000)]),
      redirect: 'error',
    }).catch(() => null)
    await response?.body?.cancel()
    // The process can exit while fetch is pending, including an EADDRINUSE race.
    signal.throwIfAborted()
    if (owned.result)
      throw new Error(`Service at ${url} exited before becoming ready`)
    if (
      response &&
      identity &&
      response.headers.get('x-coronabingo-ui-run') !== identity
    ) {
      throw new Error(
        `Server identity mismatch at ${url}; refusing another run's server`,
      )
    }
    if (response?.ok) return
    await delay(200, undefined, { signal })
  }
  throw new Error(`Service at ${url} did not become ready within 120 seconds`)
}

async function waitForEmulator(owned, signal) {
  const deadline = Date.now() + 120_000
  while (!owned.ready) {
    signal.throwIfAborted()
    if (owned.result) throw new Error('Firestore exited before becoming ready')
    if (Date.now() > deadline)
      throw new Error('Firestore did not become ready within 120 seconds')
    await delay(100, undefined, { signal })
  }
}

module.exports = { reservePorts, supervise, waitForService, waitForEmulator }
