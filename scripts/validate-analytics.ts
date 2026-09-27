import assert from 'assert'
import {
  logEvent,
  normalizeRoutePath,
  pageview,
  sanitizeReferrer,
} from '../utils/gtag'

const origin = 'https://coronabingo.com.ar'

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

process.env.GA_TRACKING_ID = 'G-TEST123'
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: {
    gtag: (...args: unknown[]) => {
      calls.push(args)
    },
    location: { origin },
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
logEvent('room_created')

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
  { send_to: 'G-TEST123' },
])

for (const call of calls) {
  const payload = JSON.stringify(call)
  assert.ok(!payload.includes('private-room'))
  assert.ok(!payload.includes('private-player'))
  assert.ok(!payload.includes('secret=value'))
}

console.log('Analytics routes and event destination are valid.')
