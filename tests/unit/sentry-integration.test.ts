import * as Sentry from '@sentry/browser'
import { Event, Response } from '@sentry/types'
import { afterEach, expect, it, vi } from 'vitest'

vi.mock('~/public/css/styles.css', () => ({}))
vi.mock('next/font/google', () => ({
  Atkinson_Hyperlegible_Next: () => ({ style: { fontFamily: 'test' } }),
  Bricolage_Grotesque: () => ({ style: { fontFamily: 'test' } }),
}))
vi.mock('~/contexts', () => ({ default: () => null }))
vi.mock('~/contexts/AdScript', () => ({ AdScriptProvider: () => null }))
vi.mock('~/components/PageMetadata', () => ({ default: () => null }))
vi.mock('~/utils/gtag', () => ({
  pageview: vi.fn(),
  updateAnalyticsPageContext: vi.fn(),
}))

afterEach(async () => {
  await Sentry.close().then(
    () => undefined,
    () => undefined,
  )
  vi.unstubAllEnvs()
})

it('minimizes URLs through the application-configured SDK and local transport', async () => {
  const events: Event[] = []
  class LocalTransport {
    sendEvent(event: Event): PromiseLike<Response> {
      events.push(JSON.parse(JSON.stringify(event)))
      return Promise.resolve({ status: 'success' as Response['status'] })
    }
    close() {
      return Promise.resolve(true)
    }
  }
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('SENTRY_DSN', 'https://synthetic@example.invalid/1')
  const originalInit = Sentry.init
  const init = vi.spyOn(Sentry, 'init').mockImplementation(options => {
    originalInit({ ...options, transport: LocalTransport })
  })
  Object.defineProperty(document, 'referrer', {
    configurable: true,
    value:
      'https://outside.invalid/room/REFERRER_PRIVATE?token=REF_QUERY#REF_HASH',
  })
  window.history.replaceState(
    {},
    '',
    '/en/room/ROOM_PRIVATE/PLAYER_PRIVATE?code=QUERY_PRIVATE#HASH_PRIVATE',
  )
  await import('~/pages/_app')
  expect(init).toHaveBeenCalledOnce()
  window.history.pushState(
    {},
    '',
    '/es/room/NEXT_ROOM/admin?key=NEXT_QUERY#NEXT_HASH',
  )
  Sentry.addBreadcrumb({
    category: 'console',
    message: 'CONSOLE_PRIVATE',
    data: { arguments: ['CONSOLE_PRIVATE'] },
  })
  Sentry.addBreadcrumb({
    category: 'fetch',
    data: {
      url: '/room/HTTP_PRIVATE/HTTP_PLAYER?code=HTTP_QUERY#HTTP_HASH',
      method: 'GET',
      status_code: 403,
    },
  })
  Sentry.captureException(new Error('Synthetic diagnostic failure'))
  await Sentry.flush(2000)
  expect(events).toHaveLength(1)
  expect(events[0].exception?.values?.[0].value).toBe(
    'Synthetic diagnostic failure',
  )
  expect(events[0].breadcrumbs).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        category: 'fetch',
        data: {
          url: '/room/[roomId]/[playerId]',
          method: 'GET',
          status_code: 403,
        },
      }),
    ]),
  )
  expect(events[0].request?.url).toBe('/es/room/[roomId]/admin')
  expect(events[0].request?.headers?.Referer).toBeUndefined()
  expect(events[0].breadcrumbs).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        category: 'navigation',
        data: {
          from: '/en/room/[roomId]/[playerId]',
          to: '/es/room/[roomId]/admin',
        },
      }),
    ]),
  )
  expect(JSON.stringify(events)).not.toMatch(
    /CONSOLE_PRIVATE|HTTP_PRIVATE|HTTP_PLAYER|HTTP_QUERY|HTTP_HASH|ROOM_PRIVATE|PLAYER_PRIVATE|QUERY_PRIVATE|HASH_PRIVATE|REFERRER_PRIVATE|REF_QUERY|REF_HASH|NEXT_ROOM|NEXT_QUERY|NEXT_HASH/,
  )
})
