import {
  AnalyticsEventMap,
  AnalyticsEventName,
  CapturedAnalyticsEvent,
} from '~/interfaces/analytics/Events'
import { getAnalyticsPageContext } from './analyticsPageContext'

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
let configuredPageContext:
  | ReturnType<typeof getAnalyticsPageContext>
  | undefined

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

export const sanitizeReferrer = (referrer: string, origin: string) =>
  getAnalyticsPageContext(origin, referrer).page_referrer

const getEventPageContext = (location = window.location.href) => {
  const context = getAnalyticsPageContext(
    location,
    configuredPageContext?.page_location || document.referrer,
  )
  return configuredPageContext &&
    context.page_location === configuredPageContext.page_location
    ? configuredPageContext
    : context
}

// Update the stream defaults, not just the next manually emitted event.
// beforeHistoryChange calls this before Google observes the new browser URL.
export const updateAnalyticsPageContext = (url?: string): void => {
  const tracking = getTracking()
  if (!tracking) return

  try {
    const location = new URL(
      url || window.location.href,
      window.location.origin,
    ).href
    const context = getEventPageContext(location)
    if (context === configuredPageContext) return

    tracking.gtag?.('config', tracking.trackingId, {
      ...context,
      send_page_view: false,
      update: true,
    })
    configuredPageContext = context
  } catch {
    // A blocked or failing tag must never cancel a router transition.
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
  updateAnalyticsPageContext(location)
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
