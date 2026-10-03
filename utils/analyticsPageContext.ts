// This function is also serialized into the document bootstrap. Keep it
// self-contained so the inline script needs no bundled imports or closures.
export const getAnalyticsPageContext = (location: string, referrer: string) => {
  const currentUrl = new URL(location)
  const sanitize = (value: string) => {
    if (!value) return ''

    try {
      const url = new URL(value)
      if (url.origin !== currentUrl.origin) return `${url.origin}/`

      const path = url.pathname.replace(/\/$/, '') || '/'
      const roomRoute = path.match(/^(\/(?:es|en))?\/room\/[^/]+(?:\/([^/]+))?/)
      if (!roomRoute) return `${url.origin}${path}`

      // Index directly: downlevel destructuring adds an out-of-scope helper
      // when this function is serialized by the scripts' ES5 compiler.
      const localePrefix = roomRoute[1] || ''
      const roomChild = roomRoute[2]
      const child = roomChild
        ? roomChild === 'admin'
          ? '/admin'
          : '/[playerId]'
        : ''
      return `${url.origin}${localePrefix}/room/[roomId]${child}`
    } catch {
      return ''
    }
  }

  return {
    page_location: sanitize(location),
    page_referrer: sanitize(referrer),
  }
}

export const getAnalyticsInitializationScript = (trackingId: string) => `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  (function () {
    var context = (${getAnalyticsPageContext.toString()})(window.location.href, document.referrer);
    gtag('config', ${JSON.stringify(trackingId).replace(/</g, '\\u003c')}, {
      send_page_view: false,
      page_location: context.page_location,
      page_referrer: context.page_referrer
    });
  })();
`
