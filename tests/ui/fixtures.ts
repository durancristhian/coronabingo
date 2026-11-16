import { test as base, expect, BrowserContext, Page } from '@playwright/test'
import { baseURL, firestorePort } from './environment'
import { isolateBrowserNetwork } from '../../scripts/browser-isolation'

// The Next.js development overlay covers the app after expected page errors,
// which tests assert through `pageerror`. Compiled builds have no overlay.
async function hideDevelopmentOverlay(context: BrowserContext) {
  if (process.env.UI_TEST_MODE !== 'development') return
  await context.addInitScript(() => {
    const style = document.createElement('style')
    style.textContent = 'nextjs-portal { display: none !important; }'
    const hide = () => document.documentElement.append(style)
    if (document.documentElement) hide()
    else document.addEventListener('DOMContentLoaded', hide, { once: true })
  })
}

export const test = base.extend<{ playerPage: Page }>({
  context: async ({ context }, use) => {
    const hostedFirebase = await isolateBrowserNetwork(context, {
      baseURL,
      firestorePort,
    })
    await hideDevelopmentOverlay(context)
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
    await hideDevelopmentOverlay(context)
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
