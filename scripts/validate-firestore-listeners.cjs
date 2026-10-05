// Execute the real providers with React/router/Firestore doubles. No network.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

const flushImports = () => new Promise(resolve => setImmediate(resolve))
const states = {
  NOT_ASKED: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILURE: 'failure',
}

function providerHarness(name) {
  const hooks = []
  const events = []
  const callbacks = []
  const router = { pathname: '/', query: {} }
  let cursor = 0
  let value
  let failImport = false
  const react = {
    createContext: () => ({ Provider: 'provider' }),
    createElement: (_type, props) => {
      value = props.value
    },
    useState: initial => {
      const index = cursor++
      if (!hooks[index]) hooks[index] = { value: initial }
      return [
        hooks[index].value,
        next => {
          hooks[index].value =
            typeof next === 'function' ? next(hooks[index].value) : next
        },
      ]
    },
    useRef: initial => {
      const index = cursor++
      return hooks[index] || (hooks[index] = { current: initial })
    },
    useEffect: (effect, deps) => {
      const index = cursor++
      const previous = hooks[index]
      if (previous && deps.every((dep, i) => dep === previous.deps[i])) return
      previous?.cleanup?.()
      hooks[index] = { deps, cleanup: effect() }
    },
  }
  const listen = target => (...args) => {
    events.push(`listen:${target}`)
    callbacks.push(args.filter(arg => typeof arg === 'function'))
    return () => events.push(`unsubscribe:${target}`)
  }
  const modules = {
    react,
    'next/router': { useRouter: () => router },
    '~/interfaces/custom/RemoteData': { REMOTE_DATA: states },
    '~/utils/firebase': {
      roomsRef: {
        doc: id => ({
          onSnapshot: listen(id),
          collection: collection => ({
            onSnapshot: listen(`${id}/${collection}`),
          }),
        }),
      },
    },
  }
  const source = fs.readFileSync(
    path.join(__dirname, '../contexts', `${name}.tsx`),
    'utf8',
  )
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
  }).outputText
  const exports = {}
  vm.runInNewContext(code, {
    exports,
    console,
    require: id => {
      if (id === '~/utils/firebase' && failImport)
        throw new Error('Chunk unavailable')
      assert.ok(id in modules, `Unmocked import: ${id}`)
      return modules[id]
    },
  })
  const Provider = exports[`${name}ContextProvider`]
  const render = (pathname = router.pathname, query = router.query) => {
    Object.assign(router, { pathname, query })
    cursor = 0
    Provider({ children: null })
    return value
  }
  return {
    render,
    events,
    callbacks,
    fail: () => {
      failImport = true
    },
    unmount: () => hooks.forEach(hook => hook.cleanup?.()),
  }
}

async function main() {
  const cases = [
    ['/', {}, []],
    ['/', { roomId: 'a', playerId: 'p' }, []],
    ['/room/[roomId]', { roomId: 'a' }, ['a', 'a/players']],
    ['/room/[roomId]/admin', { roomId: 'a' }, ['a', 'a/players']],
    [
      '/room/[roomId]/[playerId]',
      { roomId: 'a', playerId: 'p' },
      ['a', 'a/players/p'],
    ],
  ]
  for (const [route, query, expected] of cases) {
    const providers = ['Room', 'Players', 'Player'].map(providerHarness)
    providers.forEach(p => p.render(route, query))
    await flushImports()
    assert.deepEqual(
      providers.flatMap(p => p.events),
      expected.map(id => `listen:${id}`),
    )
    providers.forEach(p => p.unmount())
    assert.deepEqual(
      providers.flatMap(p =>
        p.events.filter(e => e.startsWith('unsubscribe:')),
      ),
      expected.map(id => `unsubscribe:${id}`),
    )
  }
  for (const name of ['Room', 'Players', 'Player']) {
    const route =
      name === 'Player' ? '/room/[roomId]/[playerId]' : '/room/[roomId]'
    const query = { roomId: 'a', playerId: 'p' }
    const earlyExit = providerHarness(name)
    earlyExit.render(route, query)
    earlyExit.render('/', {})
    await flushImports()
    assert.deepEqual(
      earlyExit.events,
      [],
      `${name}: no listener after leaving during import`,
    )

    const changed = providerHarness(name)
    changed.render(route, query)
    changed.render(route, { ...query, roomId: 'b' })
    await flushImports()
    assert.equal(
      changed.events.length,
      1,
      `${name}: only the latest room subscribes`,
    )
    assert.ok(changed.events[0].startsWith('listen:b'))
    changed.render('/', {})
    const before = JSON.stringify(changed.render().state)
    const [snapshot, error] = changed.callbacks[0]
    snapshot({ exists: false, metadata: { hasPendingWrites: false }, docs: [] })
    error(new Error('Late error'))
    assert.equal(
      JSON.stringify(changed.render().state),
      before,
      `${name}: ignore stale callbacks`,
    )
    assert.equal(changed.events.length, 2, `${name}: one cleanup`)

    const failure = providerHarness(name)
    failure.fail()
    failure.render(route, query)
    await flushImports()
    assert.equal(
      failure.render().state.type,
      states.FAILURE,
      `${name}: load failure is visible`,
    )
    failure.unmount()
  }
  const players = providerHarness('Players')
  for (const [route, query] of [
    ['/', {}],
    ['/room/[roomId]/admin', { roomId: 'a' }],
    ['/room/[roomId]', { roomId: 'a' }],
    ['/room/[roomId]/[playerId]', { roomId: 'a', playerId: 'p' }],
    ['/room/[roomId]', { roomId: 'a' }],
    ['/room/[roomId]', { roomId: 'b' }],
    ['/', {}],
  ]) {
    players.render(route, query)
    await flushImports()
  }
  assert.deepEqual(players.events, [
    'listen:a/players',
    'unsubscribe:a/players',
    'listen:a/players',
    'unsubscribe:a/players',
    'listen:b/players',
    'unsubscribe:b/players',
  ])
  console.log(
    'Firestore listener probe passed: home 0, lobby/setup/cards 2 each; cleanup, navigation during load, stale callbacks, and load failures.',
  )
}
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
