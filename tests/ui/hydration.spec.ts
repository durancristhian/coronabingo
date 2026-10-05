import { Page } from '@playwright/test'
import { test, expect } from './fixtures'

const hydrationMessage = /hydrati|server HTML|server-rendered|Minified React error #(418|423|425)/i

function collectHydrationErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', error => {
    if (hydrationMessage.test(error.message)) errors.push(error.message)
  })
  page.on('console', message => {
    if (
      ['error', 'warning'].includes(message.type()) &&
      hydrationMessage.test(message.text())
    ) {
      errors.push(message.text())
    }
  })
  return errors
}

async function afterHydration(page: Page) {
  // Next mounts the route announcer on the client. Allow recoverable React
  // errors queued during that commit to reach the listeners before asserting.
  await page.locator('#__next-route-announcer__').waitFor({ state: 'attached' })
  await page.evaluate(
    () =>
      new Promise<void>(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
}

for (const locale of ['es', 'en']) {
  for (const route of ['home', 'missing-room']) {
    test(`${locale}: ${route} hydration on entry, reload and navigation`, async ({
      page,
    }, testInfo) => {
      const errors = collectHydrationErrors(page)
      const prefix = locale === 'en' ? '/en' : ''
      const path =
        route === 'home'
          ? `${prefix}/`
          : `${prefix}/room/hyd-01-missing?qa=hydration#qa`
      const attempts: {
        attempt: number
        phase: string
        errors: string[]
      }[] = []

      try {
        for (let attempt = 1; attempt <= 5; attempt++) {
          for (const phase of ['entry', 'reload']) {
            if (phase === 'entry') await page.goto(path)
            else await page.reload()
            await afterHydration(page)
            if (route === 'home') {
              await expect(page.locator('#name')).toBeVisible()
            } else {
              await expect(
                page.getByRole('button', {
                  name: locale === 'en' ? 'Reload' : 'Recargar',
                  exact: true,
                }),
              ).toBeVisible()
            }
            attempts.push({ attempt, phase, errors: [...errors] })
            expect(errors, `${path}: ${phase} ${attempt}`).toEqual([])
          }

          // The header uses a document navigation; the locale control uses SPA
          // routing. Exercise both without creating gameplay records.
          if (route === 'missing-room') {
            await page
              .getByRole('link', { name: 'Coronabingo', exact: true })
              .click()
          }
          await expect(page.locator('#name')).toBeVisible()
          await afterHydration(page)
          const timeOrigin = await page.evaluate(() => performance.timeOrigin)
          const otherLocale = locale === 'en' ? 'es' : 'en'
          await page.locator('#language').selectOption(otherLocale)
          await expect(page.locator('#language')).toHaveValue(otherLocale)
          await afterHydration(page)
          expect(await page.evaluate(() => performance.timeOrigin)).toBe(
            timeOrigin,
          )
          attempts.push({ attempt, phase: 'navigation', errors: [...errors] })
          expect(errors).toEqual([])
        }
      } finally {
        await testInfo.attach('hydration-matrix', {
          contentType: 'application/json',
          body: JSON.stringify({ locale, route, attempts }, null, 2),
        })
      }
    })
  }
}

test('hydration diagnostic detects a controlled pre-hydration DOM mismatch', async ({
  page,
}) => {
  const errors = collectHydrationErrors(page)
  // Positive control for the diagnostic, not a reproduction of HYD-01's cause.
  // Defer scripts execute after parsing. Remove SSR content immediately before
  // the real React runtime executes, with every external request still blocked.
  let injected = false
  await page.route(
    /\/_next\/static\/chunks\/(framework[^/]*|main)\.js/,
    async route => {
      const response = await route.fetch()
      injected = true
      await route.fulfill({
        response,
        body: `document.querySelector('header h1')?.remove();\n${await response.text()}`,
      })
    },
  )
  await page.goto('/')
  await afterHydration(page)
  expect(injected).toBe(true)
  await expect.poll(() => errors.length).toBeGreaterThan(0)
  await expect(page.locator('header h1')).toHaveText('Coronabingo')
})
