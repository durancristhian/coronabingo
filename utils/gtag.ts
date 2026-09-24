type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void
}

let previousLocation = typeof window === 'undefined' ? '' : window.location.href

// Initial views come from the document's config; history views are manual.
export const pageview = (url: string): void => {
  const trackingId = process.env.GA_TRACKING_ID
  const gtag = (window as AnalyticsWindow).gtag
  if (!trackingId || typeof gtag !== 'function') return

  const location = new URL(url, window.location.origin).href
  if (location === previousLocation) return

  if (trackingId.startsWith('G-')) {
    gtag('event', 'page_view', {
      send_to: trackingId,
      page_location: location,
      page_title: document.title,
      page_referrer: previousLocation || document.referrer,
    })
  } else {
    // Keep existing UA configuration working in environments not migrated yet.
    gtag('config', trackingId, { page_path: url })
  }
  previousLocation = location
}
