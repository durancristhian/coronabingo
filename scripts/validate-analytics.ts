import assert from 'assert'
import { AnalyticsLog } from '../interfaces/analytics/Events'
import {
  getRoomCreatedEventParams,
  getRoomRestartedEventParams,
  getRoomStartedEventParams,
} from '../utils/analyticsEvents'
import {
  ANALYTICS_TEST_STORAGE_KEY,
  logEvent,
  normalizeRoutePath,
  pageview,
  sanitizeReferrer,
} from '../utils/gtag'

const origin = 'https://coronabingo.com.ar'
const createdAt = new Date('2026-09-27T12:00:00.000Z')
const roomCreatedParams = getRoomCreatedEventParams('es', createdAt)
const roomStartedParams = getRoomStartedEventParams({
  createdAt,
  hideNumbersMeaning: true,
  language: 'en',
  playNumber: 2,
  playerCount: 14,
  usesOnlineSpinner: false,
})
const roomRestartedParams = getRoomRestartedEventParams({
  createdAt,
  language: 'es',
  playNumber: 1,
})

assert.deepStrictEqual(roomCreatedParams, {
  room_created_date: '2026-09-27',
  schema_version: 'v1',
  ui_language: 'es',
})
assert.deepStrictEqual(roomStartedParams, {
  number_meanings: 'hidden',
  play_kind: 'replay',
  play_number: 2,
  player_count: 14,
  room_created_date: '2026-09-27',
  schema_version: 'v1',
  spinner_mode: 'physical',
  ui_language: 'en',
})
assert.deepStrictEqual(roomRestartedParams, {
  first_restart: 'yes',
  restart_number: 1,
  room_created_date: '2026-09-27',
  schema_version: 'v1',
  ui_language: 'es',
})

const validateAnalyticsTypes = (log: AnalyticsLog) => {
  log('room_created', roomCreatedParams)
  log('room_started', roomStartedParams)

  // @ts-expect-error Room names are not part of the room_created contract.
  log('room_created', { ...roomCreatedParams, description: 'private name' })
  // @ts-expect-error Spinner values must use the closed analytics vocabulary.
  log('room_started', { ...roomStartedParams, spinner_mode: 'sometimes' })
}

void validateAnalyticsTypes

assert.strictEqual(normalizeRoutePath('/', 'es', 'es'), '/')
assert.strictEqual(normalizeRoutePath('/', 'en', 'es'), '/en')
assert.strictEqual(
  normalizeRoutePath('/room/[roomId]/[playerId]', 'es', 'es'),
  '/room/[roomId]/[playerId]',
)
assert.strictEqual(
  normalizeRoutePath('/room/[roomId]/[playerId]', 'en', 'es'),
  '/en/room/[roomId]/[playerId]',
)
assert.strictEqual(
  normalizeRoutePath('/room/[roomId]?private=value#fragment', 'es', 'es'),
  '/room/[roomId]',
)

assert.strictEqual(
  sanitizeReferrer(`${origin}/room/private-room?secret=value`, origin),
  `${origin}/room/[roomId]`,
)
assert.strictEqual(
  sanitizeReferrer(`${origin}/room/private-room/admin#secret`, origin),
  `${origin}/room/[roomId]/admin`,
)

assert.strictEqual(
  sanitizeReferrer(
    `${origin}/en/room/private-room/private-player?secret=value`,
    origin,
  ),
  `${origin}/en/room/[roomId]/[playerId]`,
)
assert.strictEqual(
  sanitizeReferrer('https://example.com/private/path?secret=value', origin),
  'https://example.com/',
)

const calls: unknown[][] = []
const sessionStorageValues = new Map<string, string>()

process.env.GA_TRACKING_ID = 'G-TEST123'
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: {
    gtag: (...args: unknown[]) => {
      calls.push(args)
    },
    location: { origin },
    sessionStorage: {
      getItem: (key: string) => sessionStorageValues.get(key) || null,
      setItem: (key: string, value: string) => {
        sessionStorageValues.set(key, value)
      },
    },
  },
})
Object.defineProperty(globalThis, 'document', {
  configurable: true,
  value: {
    referrer: `${origin}/room/private-room/private-player?secret=value`,
    title: 'Coronabingo | Tu juego de Bingo Online',
  },
})

pageview({
  defaultLocale: 'es',
  locale: 'es',
  pathname: '/room/[roomId]/[playerId]',
})
pageview({
  defaultLocale: 'es',
  locale: 'es',
  pathname: '/room/[roomId]/[playerId]',
})
pageview({
  defaultLocale: 'es',
  locale: 'en',
  pathname: '/room/[roomId]/[playerId]',
})
logEvent('room_created', roomCreatedParams)

assert.strictEqual(calls.length, 3)
assert.deepStrictEqual(calls[0], [
  'event',
  'page_view',
  {
    send_to: 'G-TEST123',
    page_location: `${origin}/room/[roomId]/[playerId]`,
    page_title: 'Coronabingo | Tu juego de Bingo Online',
    page_referrer: `${origin}/room/[roomId]/[playerId]`,
  },
])
assert.deepStrictEqual(calls[1], [
  'event',
  'page_view',
  {
    send_to: 'G-TEST123',
    page_location: `${origin}/en/room/[roomId]/[playerId]`,
    page_title: 'Coronabingo | Tu juego de Bingo Online',
    page_referrer: `${origin}/room/[roomId]/[playerId]`,
  },
])
assert.deepStrictEqual(calls[2], [
  'event',
  'room_created',
  { ...roomCreatedParams, send_to: 'G-TEST123' },
])

for (const call of calls) {
  const payload = JSON.stringify(call)
  assert.ok(!payload.includes('private-room'))
  assert.ok(!payload.includes('private-player'))
  assert.ok(!payload.includes('secret=value'))
}

process.env.UI_TESTS = '1'
logEvent('room_restarted', roomRestartedParams)
delete process.env.UI_TESTS

assert.strictEqual(calls.length, 3)
assert.deepStrictEqual(
  JSON.parse(sessionStorageValues.get(ANALYTICS_TEST_STORAGE_KEY) || '[]'),
  [
    {
      eventName: 'room_restarted',
      eventParams: roomRestartedParams,
    },
  ],
)

console.log('Analytics routes and event destination are valid.')
