/* eslint-disable @typescript-eslint/camelcase */

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  // @ts-ignore
  window.gtag('config', process.env.GA_TRACKING_ID, {
    page_path: url,
  })
}
