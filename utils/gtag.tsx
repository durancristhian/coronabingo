/* TODO: configure an .env file */
export const GA_TRACKING_ID = 'UA-161408428-1'

export const pageview = (url: string) => {
  // @ts-ignore
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url
  })
}
