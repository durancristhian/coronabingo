/* eslint-disable @typescript-eslint/camelcase */

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  // @ts-ignore
  window.gtag('config', process.env.GA_TRACKING_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (
  action: string,
  category: string,
  label: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
): void => {
  // @ts-ignore
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: JSON.stringify(value),
  })
}
