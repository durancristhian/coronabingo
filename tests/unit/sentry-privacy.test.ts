import { describe, expect, it } from 'vitest'
import {
  minimizeSentryBreadcrumb,
  minimizeSentryEvent,
  minimizeSentryUrl,
} from '~/utils/sentryPrivacy'

describe('Sentry URL minimization', () => {
  it.each([
    ['/en?secret', '/en'],
    ['/es/#secret', '/es'],
    ['/', '/'],
    ['/room/secret', '/room/[roomId]'],
    [
      '/en/room/secret/player?token=secret#secret',
      '/en/room/[roomId]/[playerId]',
    ],
    ['/es/room/secret/admin?secret', '/es/room/[roomId]/admin'],
    ['https://user:secret@outside.invalid/privacy?q=secret#secret', '/privacy'],
    ['/en/about?secret', '/en/about'],
    ['https://outside.invalid/private/secret', '[url]'],
    ['/room/%73ecret/%70layer/secret', '/room/[roomId]/[playerId]'],
    ['data:text/plain,secret', '[url]'],
    [
      'https://app.invalid/_next/static/chunks/app-123.js?q=secret',
      '/_next/static/chunks/app-123.js',
    ],
  ])('minimizes %s', (input, expected) =>
    expect(minimizeSentryUrl(input)).toBe(expected),
  )

  it('retains errors and stack coordinates while minimizing embedded URLs and request fields', () => {
    const event = minimizeSentryEvent({
      message: 'Failed https://app.invalid/room/SECRET/PLAYER?token=TOKEN#HASH',
      exception: {
        values: [
          {
            type: 'TypeError',
            value: 'Failed operation',
            stacktrace: {
              frames: [
                {
                  filename:
                    'https://app.invalid/_next/static/chunks/app.js?q=SECRET',
                  lineno: 42,
                  colno: 7,
                },
              ],
            },
          },
        ],
      },
      request: {
        url: '/room/SECRET',
        headers: {
          Referer: 'https://private.invalid/SECRET',
          Authorization: 'SECRET',
          'User-Agent': 'Browser',
        },
        data: 'SECRET',
      },
      extra: { componentStack: 'at https://app.invalid/room/SECRET/admin' },
      breadcrumbs: [
        {
          category: 'console',
          message: 'SECRET',
          data: { arguments: ['SECRET'] },
        },
      ],
    })
    expect(JSON.stringify(event)).not.toMatch(
      /SECRET|PLAYER|TOKEN|HASH|private.invalid/,
    )
    expect(event.message).toBe('Failed /room/[roomId]/[playerId]')
    expect(event.exception?.values?.[0].stacktrace?.frames?.[0]).toEqual({
      filename: '/_next/static/chunks/app.js',
      lineno: 42,
      colno: 7,
    })
    expect(event.request?.headers).toEqual({ 'User-Agent': 'Browser' })
  })

  it('keeps only bounded HTTP breadcrumb diagnostics and is idempotent', () => {
    const crumb = minimizeSentryBreadcrumb({
      category: 'fetch',
      data: {
        url: '/room/SECRET/PLAYER?q=SECRET',
        method: 'POST',
        status_code: 403,
        body: 'SECRET',
      },
    })
    expect(crumb.data).toEqual({
      url: '/room/[roomId]/[playerId]',
      method: 'POST',
      status_code: 403,
    })
    expect(minimizeSentryBreadcrumb(crumb)).toEqual(crumb)
  })
})
