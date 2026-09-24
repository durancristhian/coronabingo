// Executes the real provider functions with mocked React/router/Firestore.
// No network or database access. This measures initial registration and cleanup,
// not navigation, snapshots, billing, or React reconciliation.
const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const vm = require('node:vm')
const ts = require('typescript')
const root = path.resolve(__dirname, '../..')
const sourceRefArgumentIndex = process.argv.indexOf('--players-source-ref')
const playersSourceRef = sourceRefArgumentIndex === -1
  ? undefined
  : process.argv[sourceRefArgumentIndex + 1]

if (sourceRefArgumentIndex !== -1 && !playersSourceRef) {
  throw new Error('--players-source-ref requires a Git revision')
}
const cases = [
  ['home', '/', {}],
  ['lobby', '/room/[roomId]', { roomId: 'test-room' }],
  ['setup', '/room/[roomId]/admin', { roomId: 'test-room' }],
  ['cards', '/room/[roomId]/[playerId]', { roomId: 'test-room', playerId: 'test-player' }],
]
const expectedRegistrations = {
  home: [],
  lobby: ['doc:test-room', 'collection:test-room/players'],
  setup: ['doc:test-room', 'collection:test-room/players'],
  cards: ['doc:test-room', 'doc:test-room/players/test-player'],
}
const expectedLifecycleEvents = [
  'listen:room-a/players',
  'unsubscribe:room-a/players',
  'listen:room-a/players',
  'unsubscribe:room-a/players',
  'listen:room-b/players',
  'unsubscribe:room-b/players',
]

const loadProvider = (name, modules) => {
  const source = name === 'Players' && playersSourceRef
    ? execFileSync(
      'git',
      ['show', `${playersSourceRef}:contexts/Players.tsx`],
      { cwd: root, encoding: 'utf8' },
    )
    : fs.readFileSync(path.join(root, 'contexts', `${name}.tsx`), 'utf8')
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true } }).outputText
  const exports = {}
  vm.runInNewContext(code, {
    exports,
    require: id => {
      if (!(id in modules)) throw new Error(`Unmocked import: ${id}`)
      return modules[id]
    },
    console,
  })

  return exports[`${name}ContextProvider`]
}

const results = cases.map(([screen, pathname, query]) => {
  const registrations = []
  const cleanups = []
  let unsubscribeCalls = 0
  const listen = target => () => {
    registrations.push(target)
    return () => { unsubscribeCalls += 1 }
  }
  const react = {
    createContext: () => ({ Provider: () => null }),
    createElement: () => null,
    useState: value => [value, () => {}],
    useRef: value => ({ current: value }),
    useEffect: effect => {
      const cleanup = effect()
      if (typeof cleanup === 'function') cleanups.push(cleanup)
    },
  }
  const modules = {
    react,
    'next/router': { useRouter: () => ({ pathname, query }) },
    '~/interfaces/custom/RemoteData': { REMOTE_DATA: { NOT_ASKED: 'not-asked', LOADING: 'loading', SUCCESS: 'success', FAILURE: 'failure' } },
    '~/utils/firebase': { roomsRef: { doc: id => ({
      onSnapshot: listen(`doc:${id}`),
      collection: collection => ({ onSnapshot: listen(`collection:${id}/${collection}`) }),
    }) } },
  }
  for (const name of ['Room', 'Players', 'Player']) {
    loadProvider(name, modules)({ children: null })
  }
  cleanups.forEach(cleanup => cleanup())
  return { screen, registrations, unsubscribeCalls }
})

const measurePlayerListLifecycle = () => {
  const events = []
  const hooks = []
  const router = { pathname: '/', query: {} }
  let hookIndex = 0

  const react = {
    createContext: () => ({ Provider: () => null }),
    createElement: () => null,
    useState: initialValue => {
      const index = hookIndex++
      if (!hooks[index]) hooks[index] = { value: initialValue }

      return [
        hooks[index].value,
        nextValue => {
          hooks[index].value = typeof nextValue === 'function'
            ? nextValue(hooks[index].value)
            : nextValue
        },
      ]
    },
    useRef: initialValue => {
      const index = hookIndex++
      if (!hooks[index]) hooks[index] = { current: initialValue }

      return hooks[index]
    },
    useEffect: (effect, dependencies) => {
      const index = hookIndex++
      const previous = hooks[index]
      const changed = !previous || dependencies.some(
        (dependency, dependencyIndex) => dependency !== previous.dependencies[dependencyIndex],
      )

      if (!changed) return

      if (typeof previous?.cleanup === 'function') previous.cleanup()
      hooks[index] = { dependencies, cleanup: effect() }
    },
  }
  const modules = {
    react,
    'next/router': { useRouter: () => router },
    '~/interfaces/custom/RemoteData': { REMOTE_DATA: { NOT_ASKED: 'not-asked', LOADING: 'loading', SUCCESS: 'success', FAILURE: 'failure' } },
    '~/utils/firebase': { roomsRef: { doc: roomId => ({
      collection: collection => ({
        onSnapshot: () => {
          const target = `${roomId}/${collection}`
          events.push(`listen:${target}`)

          return () => events.push(`unsubscribe:${target}`)
        },
      }),
    }) } },
  }
  const PlayersContextProvider = loadProvider('Players', modules)
  const render = (pathname, query) => {
    router.pathname = pathname
    router.query = query
    hookIndex = 0
    PlayersContextProvider({ children: null })
  }

  render('/', {})
  render('/room/[roomId]/admin', { roomId: 'room-a' })
  render('/room/[roomId]', { roomId: 'room-a' })
  render('/room/[roomId]/[playerId]', { roomId: 'room-a', playerId: 'player-a' })
  render('/room/[roomId]', { roomId: 'room-a' })
  render('/room/[roomId]', { roomId: 'room-b' })
  render('/', {})

  return events
}

const lifecycleEvents = measurePlayerListLifecycle()

console.log(JSON.stringify({
  method: `Actual providers with mocked dependencies; initial mount/cleanup matrix plus Players route lifecycle${playersSourceRef ? `; Players loaded from ${playersSourceRef}` : ''}`,
  results,
  lifecycleEvents,
}, null, 2))
if (process.argv.includes('--expect-scoped')) {
  for (const result of results) {
    const expected = expectedRegistrations[result.screen]
    if (JSON.stringify(result.registrations) !== JSON.stringify(expected)) {
      console.error(
        `FAIL: ${result.screen} registered ${JSON.stringify(result.registrations)}; expected ${JSON.stringify(expected)}`,
      )
      process.exitCode = 1
    }
    if (result.unsubscribeCalls !== expected.length) {
      console.error(
        `FAIL: ${result.screen} cleaned up ${result.unsubscribeCalls} listeners; expected ${expected.length}`,
      )
      process.exitCode = 1
    }
  }
  if (JSON.stringify(lifecycleEvents) !== JSON.stringify(expectedLifecycleEvents)) {
    console.error(
      `FAIL: lifecycle emitted ${JSON.stringify(lifecycleEvents)}; expected ${JSON.stringify(expectedLifecycleEvents)}`,
    )
    process.exitCode = 1
  }
}
