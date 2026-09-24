import { test as base, expect, BrowserContext, Page } from '@playwright/test'
import { baseURL, firestorePort } from './environment'

async function isolateNetwork(context: BrowserContext) {
  const hostedFirebase: string[] = []
  const allowed = new Set([baseURL, `http://127.0.0.1:${firestorePort}`])
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (allowed.has(url.origin)) return route.continue()
    if (
      /googleapis\.com$|firebaseio\.com$|firebaseapp\.com$/.test(url.hostname)
    ) {
      hostedFirebase.push(url.hostname)
    }
    return route.abort('blockedbyclient')
  })
  await context.routeWebSocket(/.*/, socket => {
    const url = new URL(socket.url())
    if (url.origin === baseURL.replace('http:', 'ws:')) socket.connectToServer()
    else socket.close()
  })
  return hostedFirebase
}

export const test = base.extend<{ playerPage: Page }>({
  context: async ({ context }, use) => {
    const hostedFirebase = await isolateNetwork(context)
    await use(context)
    expect(hostedFirebase, 'No hosted Firebase requests from host').toEqual([])
  },
  playerPage: async ({ browser, contextOptions }, use, testInfo) => {
    const context = await browser.newContext({
      ...contextOptions,
      baseURL,
      locale: 'es-AR',
      viewport: { width: 1280, height: 720 },
      serviceWorkers: 'block',
    })
    const hostedFirebase = await isolateNetwork(context)
    const page = await context.newPage()
    try {
      await use(page)
      expect(hostedFirebase, 'No hosted Firebase requests from player').toEqual(
        [],
      )
    } finally {
      if (testInfo.status !== testInfo.expectedStatus) {
        await testInfo.attach('player-failure', {
          body: await page.screenshot(),
          contentType: 'image/png',
        })
      }
      await context.close()
    }
  },
})
export { expect }
