type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void
}

export type AnalyticsEventParams = Record<string, string | number | boolean>

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

export const logEvent = (
  eventName: string,
  eventParams: AnalyticsEventParams = {},
): void => {
  const tracking = getTracking()
  if (!tracking) return

  tracking.gtag?.('event', eventName, {
    ...eventParams,
    send_to: tracking.trackingId,
  })
}
