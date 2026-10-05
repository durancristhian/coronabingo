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

// Replay the first divergent node captured on Production: Auto ads inserts a
// sibling before the layout content. No advertising SDK or delivery is needed.
const insertAutoAd = `
  window.__hydOriginalHeading = document.querySelector('header h1');
  const target = document.querySelector('main.cb-layout > .cb-layout-main');
  if (!target) throw new Error('Auto-ad replay target is missing');
  const ad = document.createElement('div');
  ad.className = 'google-auto-placed';
  ad.innerHTML = '<ins class="adsbygoogle" data-ad-format="auto"></ins>';
  target.parentNode.insertBefore(ad, target);
`

test('Auto ads insertion before hydration reproduces root recovery', async ({
  page,
}) => {
  const errors = collectHydrationErrors(page)
  // Defer scripts execute after parsing. Replay before the React runtime, with
  // every external request still blocked by the isolated fixtures.
  let injected = false
  await page.route(
    /\/_next\/static\/chunks\/(framework[^/]*|main)\.js/,
    async route => {
      const response = await route.fetch()
      injected = true
      await route.fulfill({
        response,
        body: `(() => { ${insertAutoAd} })();\n${await response.text()}`,
      })
    },
  )
  await page.goto('/')
  await afterHydration(page)
  expect(injected).toBe(true)
  await expect.poll(() => errors.length).toBeGreaterThan(0)
  await expect(page.locator('header h1')).toHaveText('Coronabingo')
  expect(
    await page.evaluate(
      "window.__hydOriginalHeading === document.querySelector('header h1')",
    ),
  ).toBe(false)
  await expect(page.locator('.google-auto-placed')).toHaveCount(0)
})

test('the same Auto ads insertion after hydration preserves the root', async ({
  page,
}) => {
  const errors = collectHydrationErrors(page)
  await page.goto('/')
  await afterHydration(page)
  await page.evaluate(`(() => { ${insertAutoAd} })()`)
  await afterHydration(page)
  await page.locator('#language').selectOption('en')
  await expect(page.locator('#language')).toHaveValue('en')
  await afterHydration(page)
  expect(errors).toEqual([])
  expect(
    await page.evaluate(
      "window.__hydOriginalHeading === document.querySelector('header h1')",
    ),
  ).toBe(true)
  await expect(page.locator('.google-auto-placed')).toHaveCount(1)
})

for (const locale of ['es', 'en']) {
  test(`${locale}: the AdSense loader waits for hydration before executing`, async ({
    page,
  }) => {
    const errors = collectHydrationErrors(page)
    let requests = 0
    await page.route(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      route => {
        requests++
        return route.fulfill({
          contentType: 'application/javascript',
          body: `(() => {
          window.__hydAdStartedAfterMount = !!document.querySelector('#__next-route-announcer__');
          ${insertAutoAd}
          window.adsbygoogle = { push() {} };
        })();`,
        })
      },
    )
    const response = await page.goto(locale === 'en' ? '/en/' : '/')
    expect(await response?.text()).not.toContain(
      'src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"',
    )
    await expect(page.locator('.google-auto-placed')).toHaveCount(1)
    await afterHydration(page)
    expect(await page.evaluate('window.__hydAdStartedAfterMount')).toBe(true)
    await page.locator('#language').selectOption(locale === 'en' ? 'es' : 'en')
    await afterHydration(page)
    expect(requests).toBe(1)
    expect(errors).toEqual([])
    expect(
      await page.evaluate(
        "window.__hydOriginalHeading === document.querySelector('header h1')",
      ),
    ).toBe(true)
  })
}
