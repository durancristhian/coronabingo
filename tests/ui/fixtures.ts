import { test as base, expect, Page } from '@playwright/test'
import { baseURL, firestorePort } from './environment'
import { isolateBrowserNetwork } from '../../scripts/browser-isolation'

export const test = base.extend<{ playerPage: Page }>({
  context: async ({ context }, use) => {
    const hostedFirebase = await isolateBrowserNetwork(context, {
      baseURL,
      firestorePort,
    })
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
    const hostedFirebase = await isolateBrowserNetwork(context, {
      baseURL,
      firestorePort,
    })
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
