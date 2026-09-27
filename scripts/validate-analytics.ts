import assert from 'assert'
import { AnalyticsLog } from '../interfaces/analytics/Events'
import {
  getAnalyticsPageType,
  getBackgroundSelectedEventParams,
  getCelebrationUsedEventParams,
  getLanguageChangedEventParams,
  getPlayerCardOpenedEventParams,
  getRoomCreatedEventParams,
  getRoomRestartedEventParams,
  getRoomStartedEventParams,
  getSoundUsedEventParams,
  getTutorialEventParams,
  markFirstAnalyticsUseInPlay,
  markPlayerCardOpened,
} from '../utils/analyticsEvents'
import { getBackgroundAnalyticsValue } from '../utils/backgroundAnalytics'
import { BACKGROUND_CELL_VALUES } from '../utils/constants'
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
const celebrationUsedParams = getCelebrationUsedEventParams({
  celebrationType: 'pallbearers',
  firstUseInPlay: 'yes',
  language: 'es',
  playNumber: 2,
})
const soundUsedParams = getSoundUsedEventParams({
  firstUseInPlay: 'no',
  language: 'en',
  playNumber: 2,
  soundCatalog: 'extra',
  soundKey: 'patao_coronabingo',
})
const presetBackground = getBackgroundAnalyticsValue({
  type: 'img',
  value: 'coronavirus.gif',
})
const customBackground = getBackgroundAnalyticsValue({
  type: 'url',
  value: 'https://private.example/image.png',
})
const backgroundSelectedParams = getBackgroundSelectedEventParams({
  ...customBackground,
  language: 'en',
})
const playerCardOpenedParams = getPlayerCardOpenedEventParams({
  ...presetBackground,
  language: 'es',
  playNumber: 2,
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
assert.deepStrictEqual(celebrationUsedParams, {
  celebration_type: 'pallbearers',
  first_use_in_play: 'yes',
  play_number: 2,
  schema_version: 'v1',
  ui_language: 'es',
})
assert.deepStrictEqual(soundUsedParams, {
  first_use_in_play: 'no',
  play_number: 2,
  schema_version: 'v1',
  sound_catalog: 'extra',
  sound_key: 'patao_coronabingo',
  ui_language: 'en',
})
assert.deepStrictEqual(backgroundSelectedParams, {
  background_key: 'custom_url',
  background_source: 'custom_url',
  schema_version: 'v1',
  ui_language: 'en',
})
assert.deepStrictEqual(playerCardOpenedParams, {
  background_key: 'covid_19',
  background_source: 'preset',
  play_number: 2,
  schema_version: 'v1',
  ui_language: 'es',
})
assert.deepStrictEqual(
  BACKGROUND_CELL_VALUES.map(({ analyticsKey }) => analyticsKey),
  [
    'yellow',
    'blue',
    'orange',
    'green',
    'multicolor',
    'pikachu',
    'pokemon',
    'cremona',
    'covid_19',
    'clippy',
    'ghana_pallbearers',
    'frameworks',
    'kun_aguero',
  ],
)
assert.strictEqual(getAnalyticsPageType('/'), 'home')
assert.strictEqual(getAnalyticsPageType('/room/[roomId]'), 'room_lobby')
assert.strictEqual(
  getAnalyticsPageType('/room/[roomId]/[playerId]'),
  'player_card',
)
assert.strictEqual(getAnalyticsPageType('/room/[roomId]/admin'), 'room_setup')
assert.strictEqual(getAnalyticsPageType('/404'), 'not_found')
assert.deepStrictEqual(
  getLanguageChangedEventParams({
    fromLanguage: 'es',
    pathname: '/room/[roomId]/[playerId]',
    toLanguage: 'en',
  }),
  {
    from_language: 'es',
    page_type: 'player_card',
    schema_version: 'v1',
    to_language: 'en',
    ui_language: 'en',
  },
)
assert.deepStrictEqual(getTutorialEventParams('en'), {
  schema_version: 'v1',
  tutorial_language: 'en',
  tutorial_provider: 'youtube',
  ui_language: 'en',
})

const validateAnalyticsTypes = (log: AnalyticsLog) => {
  log('room_created', roomCreatedParams)
  log('room_started', roomStartedParams)
  log(
    'language_changed',
    getLanguageChangedEventParams({
      fromLanguage: 'es',
      pathname: '/',
      toLanguage: 'en',
    }),
  )
  log('tutorial_begin', getTutorialEventParams('es'))
  log('celebration_used', celebrationUsedParams)
  log('sound_used', soundUsedParams)
  log('background_selected', backgroundSelectedParams)
  log('player_card_opened', playerCardOpenedParams)

  // @ts-expect-error Room names are not part of the room_created contract.
  log('room_created', { ...roomCreatedParams, description: 'private name' })
  // @ts-expect-error Spinner values must use the closed analytics vocabulary.
  log('room_started', { ...roomStartedParams, spinner_mode: 'sometimes' })
  log('tutorial_opened', {
    ...getTutorialEventParams('es'),
    // @ts-expect-error Tutorial providers must use the closed analytics vocabulary.
    tutorial_provider: 'vimeo',
  })
  log('sound_used', {
    ...soundUsedParams,
    // @ts-expect-error Sound paths are not valid analytics keys.
    sound_key: '/sounds/private.mp3',
  })
  log('background_selected', {
    ...backgroundSelectedParams,
    // @ts-expect-error Raw URLs are not valid analytics background keys.
    background_key: 'https://private.example/image.png',
  })
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
const localStorageValues = new Map<string, string>()
const sessionStorageValues = new Map<string, string>()

process.env.GA_TRACKING_ID = 'G-TEST123'
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: {
    gtag: (...args: unknown[]) => {
      calls.push(args)
    },
    location: {
      origin,
      pathname: '/room/private-room/private-player',
    },
    localStorage: {
      getItem: (key: string) => localStorageValues.get(key) || null,
      setItem: (key: string, value: string) => {
        localStorageValues.set(key, value)
      },
    },
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

assert.strictEqual(
  markFirstAnalyticsUseInPlay('celebration_used', 'private-room', 1),
  'yes',
)
assert.strictEqual(
  markFirstAnalyticsUseInPlay('celebration_used', 'private-room', 1),
  'no',
)
assert.strictEqual(
  markFirstAnalyticsUseInPlay('sound_used', 'private-room', 1),
  'yes',
)
assert.strictEqual(
  markPlayerCardOpened('private-room', 'private-player', 1),
  true,
)
assert.strictEqual(
  markPlayerCardOpened('private-room', 'private-player', 1),
  false,
)
assert.strictEqual(
  markPlayerCardOpened('private-room', 'private-player', 2),
  true,
)

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
  {
    ...roomCreatedParams,
    send_to: 'G-TEST123',
    page_location: `${origin}/room/[roomId]/[playerId]`,
    page_referrer: `${origin}/room/[roomId]/[playerId]`,
  },
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
