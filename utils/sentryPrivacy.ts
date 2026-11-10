import { Breadcrumb, Event } from '@sentry/types'

// Report route shapes, never origins, credentials, queries or fragments. Unknown
// paths are intentionally opaque; static bundle paths remain useful for stacks.
export const minimizeSentryUrl = (value: string): string => {
  try {
    const url = new URL(value, 'https://sentry.invalid')
    if (!/^https?:$/.test(url.protocol)) return '[url]'
    const path = url.pathname.replace(/\/$/, '') || '/'
    const room = path.match(
      /^(\/(?:es|en))?\/room\/[^/]+(?:\/([^/]+))?(?:\/.*)?$/,
    )
    if (room) {
      return `${room[1] || ''}/room/[roomId]${
        room[2] ? (room[2] === 'admin' ? '/admin' : '/[playerId]') : ''
      }`
    }
    if (
      path === '/' ||
      /^(\/(?:es|en))?(\/(about|privacy|contact))?$/.test(path)
    )
      return path
    if (/^\/_next\/static\/[a-zA-Z0-9_./[\]-]+\.(js|css)$/.test(path))
      return path
    return '[url]'
  } catch {
    return '[url]'
  }
}

const minimizeText = (value: string) =>
  value.replace(
    /https?:\/\/[^\s<>"')]+|\/(?:es\/|en\/)?room\/[^\s<>"')]+/gi,
    minimizeSentryUrl,
  )

export const minimizeSentryBreadcrumb = (
  breadcrumb: Breadcrumb,
): Breadcrumb => {
  const { category, type, level, timestamp, event_id } = breadcrumb
  const data = breadcrumb.data || {}
  // Console arguments and DOM selectors can embed links or arbitrary player
  // input. Keep their category/timing, rather than their unbounded payloads.
  return {
    category,
    type,
    level,
    timestamp,
    event_id,
    ...(category === 'navigation' && {
      data: {
        from: minimizeSentryUrl(String(data.from || '')),
        to: minimizeSentryUrl(String(data.to || '')),
      },
    }),
    ...((category === 'xhr' || category === 'fetch') && {
      data: {
        url: minimizeSentryUrl(String(data.url || '')),
        ...(typeof data.status_code === 'number' && {
          status_code: data.status_code,
        }),
        ...(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/.test(data.method) && {
          method: data.method,
        }),
      },
    }),
  }
}

export const minimizeSentryEvent = (event: Event): Event => {
  // The SDK normalizes extras before beforeSend. Walk the resulting JSON-like
  // payload too: URL strings can occur in error values, frames and React stacks.
  const walk = (value: unknown): unknown => {
    if (typeof value === 'string') return minimizeText(value)
    if (Array.isArray(value)) return value.map(walk)
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, walk(item)]),
      )
    }
    return value
  }
  const minimized = walk(event) as Event
  if (event.request) {
    minimized.request = {
      ...(event.request.url && { url: minimizeSentryUrl(event.request.url) }),
      ...(event.request.headers?.['User-Agent'] && {
        headers: { 'User-Agent': event.request.headers['User-Agent'] },
      }),
    }
  }
  // Also minimize breadcrumbs attached directly to captureEvent, which bypass
  // beforeBreadcrumb. Use the original so URL placeholders are not re-parsed.
  if (event.breadcrumbs)
    minimized.breadcrumbs = event.breadcrumbs.map(minimizeSentryBreadcrumb)
  return minimized
}
