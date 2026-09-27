import {
  AnalyticsEventMap,
  AnalyticsEventName,
  CapturedAnalyticsEvent,
} from '~/interfaces/analytics/Events'

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void
}

export const ANALYTICS_TEST_STORAGE_KEY =
  'coronabingo:ui-tests:analytics-events:v1'

interface PageviewOptions {
  defaultLocale: string
  locale?: string
  pathname: string
}

let previousLocation = ''

const getTracking = () => {
  const trackingId = process.env.GA_TRACKING_ID
  if (
    typeof window === 'undefined' ||
    !trackingId?.startsWith('G-') ||
    typeof (window as AnalyticsWindow).gtag !== 'function'
  ) {
    return undefined
  }

  return {
    gtag: (window as AnalyticsWindow).gtag,
    trackingId,
  }
}

const withoutQueryOrHash = (pathname: string) =>
  pathname.split(/[?#]/, 1)[0] || '/'

export const normalizeRoutePath = (
  pathname: string,
  locale: string | undefined,
  defaultLocale: string,
) => {
  const path = withoutQueryOrHash(pathname)
  const normalizedPath = path === '/' ? '' : `/${path.replace(/^\/+/, '')}`
  const localePrefix = locale && locale !== defaultLocale ? `/${locale}` : ''

  return `${localePrefix}${normalizedPath}` || '/'
}

const normalizeInternalReferrerPath = (pathname: string) => {
  const path = withoutQueryOrHash(pathname).replace(/\/$/, '') || '/'
  const roomRoute = path.match(/^(\/(?:es|en))?\/room\/[^/]+(?:\/([^/]+))?$/)

  if (!roomRoute) return path

  const [, localePrefix = '', roomChild] = roomRoute
  if (!roomChild) return `${localePrefix}/room/[roomId]`

  const childRoute = roomChild === 'admin' ? 'admin' : '[playerId]'
  return `${localePrefix}/room/[roomId]/${childRoute}`
}

export const sanitizeReferrer = (referrer: string, origin: string) => {
  if (!referrer) return ''

  try {
    const url = new URL(referrer)
    if (url.origin !== origin) return `${url.origin}/`

    return `${origin}${normalizeInternalReferrerPath(url.pathname)}`
  } catch {
    return ''
  }
}

const getEventPageContext = () => {
  const origin = window.location.origin
  const pageLocation = `${origin}${normalizeInternalReferrerPath(
    window.location.pathname,
  )}`

  return {
    page_location: pageLocation,
    page_referrer: sanitizeReferrer(document.referrer, origin),
  }
}

export const pageview = ({
  defaultLocale,
  locale,
  pathname,
}: PageviewOptions): void => {
  const tracking = getTracking()
  if (!tracking) return

  const path = normalizeRoutePath(pathname, locale, defaultLocale)
  const location = `${window.location.origin}${path}`
  if (location === previousLocation) return

  tracking.gtag?.('event', 'page_view', {
    send_to: tracking.trackingId,
    page_location: location,
    page_title: document.title,
    page_referrer:
      previousLocation ||
      sanitizeReferrer(document.referrer, window.location.origin),
  })
  previousLocation = location
}

const captureTestEvent = <EventName extends AnalyticsEventName>(
  eventName: EventName,
  eventParams: AnalyticsEventMap[EventName],
) => {
  try {
    const storedEvents = window.sessionStorage.getItem(
      ANALYTICS_TEST_STORAGE_KEY,
    )
    const events = storedEvents
      ? (JSON.parse(storedEvents) as CapturedAnalyticsEvent[])
      : []
    const event = { eventName, eventParams } as CapturedAnalyticsEvent

    window.sessionStorage.setItem(
      ANALYTICS_TEST_STORAGE_KEY,
      JSON.stringify([...events, event]),
    )
  } catch {
    // Analytics test evidence must never affect gameplay.
  }
}

export const logEvent = <EventName extends AnalyticsEventName>(
  eventName: EventName,
  eventParams: AnalyticsEventMap[EventName],
): void => {
  if (process.env.UI_TESTS === '1') {
    captureTestEvent(eventName, eventParams)
    return
  }

  const tracking = getTracking()
  if (!tracking) return

  try {
    tracking.gtag?.('event', eventName, {
      ...eventParams,
      send_to: tracking.trackingId,
      ...getEventPageContext(),
    })
  } catch {
    // Analytics must never interrupt the action being measured.
  }
}
