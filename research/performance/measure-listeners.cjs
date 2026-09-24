// Executes the real provider functions with mocked React/router/Firestore.
// No network or database access. This measures initial registration and cleanup,
// not navigation, snapshots, billing, or React reconciliation.
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const root = path.resolve(__dirname, '../..')
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
    const source = fs.readFileSync(path.join(root, 'contexts', `${name}.tsx`), 'utf8')
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
    exports[`${name}ContextProvider`]({ children: null })
  }
  cleanups.forEach(cleanup => cleanup())
  return { screen, registrations, unsubscribeCalls }
})
console.log(JSON.stringify({ method: 'Actual providers, mocked dependencies, initial mount and cleanup only', results }, null, 2))
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
}
