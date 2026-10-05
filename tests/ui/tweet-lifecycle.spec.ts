import { Page } from '@playwright/test'
import { test, expect } from './fixtures'

async function revealNews(page: Page) {
  await page.locator('footer h2').scrollIntoViewIfNeeded()
}

const widgetsURL = '**://platform.twitter.com/widgets.js'
// Controlled provider boundary: the real application mounts/unmounts the embeds.
// Both factory names cover the old dependency and the owned integration.
const widgetsScript = `
  function createTweet(id, target) {
    if (!target || !target.isConnected) {
      document.documentElement.dataset.invalidTweetTarget = 'true';
      throw new Error('No target element specified');
    }
    const tweet = document.createElement('article');
    tweet.dataset.testid = 'rendered-tweet';
    tweet.textContent = id;
    target.appendChild(tweet);
    return Promise.resolve(tweet);
  }
  window.twttr = {
    ready(callback) {
      if (callback) callback(this);
      return Promise.resolve(this);
    },
    widgets: { createTweet, createTweetEmbed: createTweet }
  };
`

async function createRoomFromHome(
  page: Page,
  locale: string,
  roomName: string,
) {
  await page
    .getByRole('textbox', {
      name: locale === 'en' ? 'Room name *' : 'Nombre de la sala *',
      exact: true,
    })
    .fill(roomName)
  await page
    .getByRole('button', {
      name: locale === 'en' ? 'Create room' : 'Crear sala',
      exact: true,
    })
    .click()
  await expect(
    page.getByRole('heading', {
      name: locale === 'en' ? 'Set up room' : 'Preparar sala',
    }),
  ).toBeVisible()
}

for (const locale of ['es', 'en']) {
  test(`${locale}: delayed tweets ignore unmounted targets after navigation`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    let release!: () => void
    const gate = new Promise<void>(resolve => {
      release = resolve
    })
    let requests = 0
    await page.route(widgetsURL, async route => {
      requests++
      await gate
      await route.fulfill({
        contentType: 'application/javascript',
        body: widgetsScript,
      })
    })
    await page.goto(locale === 'en' ? '/en' : '/')
    await revealNews(page)
    await expect.poll(() => requests).toBe(1)
    await createRoomFromHome(page, locale, `Tweet lifecycle ${locale}`)
    await revealNews(page)
    release()
    await expect(page.getByTestId('rendered-tweet')).toHaveCount(4)
    await expect(page.locator('html')).not.toHaveAttribute(
      'data-invalid-tweet-target',
      'true',
    )
    expect(requests).toBe(1)
    expect(errors).toEqual([])
  })
}

test('mounted tweets render normally with one shared script', async ({
  page,
}) => {
  let requests = 0
  await page.route(widgetsURL, route => {
    requests++
    return route.fulfill({
      contentType: 'application/javascript',
      body: widgetsScript,
    })
  })
  await page.goto('/')
  await revealNews(page)
  await expect(page.getByTestId('rendered-tweet')).toHaveCount(4)
  expect(requests).toBe(1)
})

for (const locale of ['es', 'en']) {
  test(`${locale}: a failed script provides post links and retries on the next page`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    let requests = 0
    await page.route(widgetsURL, route => {
      requests++
      if (requests === 1) return route.abort('failed')
      return route.fulfill({
        contentType: 'application/javascript',
        body: widgetsScript,
      })
    })
    await page.goto(locale === 'en' ? '/en' : '/')
    await revealNews(page)
    const links = page.getByRole('link', {
      name: locale === 'en' ? 'View post' : 'Ver publicación',
      exact: true,
    })
    await expect(links).toHaveCount(4)
    await expect(links.first()).toHaveAttribute(
      'href',
      'https://twitter.com/i/web/status/1266490485650198528',
    )
    await createRoomFromHome(page, locale, `Tweet retry ${locale}`)
    await revealNews(page)
    await expect(page.getByTestId('rendered-tweet')).toHaveCount(4)
    await expect(links).toHaveCount(0)
    expect(requests).toBe(2)
    expect(errors).toEqual([])
  })

  test(`${locale}: rejected widget rendering leaves usable post links`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.route(widgetsURL, route =>
      route.fulfill({
        contentType: 'application/javascript',
        body: widgetsScript.replace(
          'return Promise.resolve(tweet);',
          'return Promise.reject(new Error("Provider render failed"));',
        ),
      }),
    )
    await page.goto(locale === 'en' ? '/en' : '/')
    await revealNews(page)
    await expect(
      page.getByRole('link', {
        name: locale === 'en' ? 'View post' : 'Ver publicación',
        exact: true,
      }),
    ).toHaveCount(4)
    await page
      .getByRole('textbox', {
        name: locale === 'en' ? 'Room name *' : 'Nombre de la sala *',
        exact: true,
      })
      .fill(`Widget failure ${locale}`)
    await expect(
      page.getByRole('button', {
        name: locale === 'en' ? 'Create room' : 'Crear sala',
        exact: true,
      }),
    ).toBeEnabled()
    expect(errors).toEqual([])
  })
}

for (const locale of ['es', 'en']) {
  for (const width of [390, 1280]) {
    test(`${locale} ${width}px: offscreen tweets wait for proximity and stay unique`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 600 })
      const requests: string[] = []
      page.on('request', request => {
        const host = new URL(request.url()).hostname
        if (/(^|\.)(twitter\.com|twimg\.com)$/.test(host)) {
          requests.push(request.url())
        }
      })
      await page.route(widgetsURL, route =>
        route.fulfill({
          contentType: 'application/javascript',
          body: widgetsScript,
        }),
      )
      await page.goto(locale === 'en' ? '/en' : '/')
      await expect(page.locator('#name')).toBeVisible()
      // Exceed the rejected fixed-delay alternative without entering the footer.
      await page.waitForTimeout(3200)
      expect(requests).toEqual([])
      await expect(page.getByTestId('rendered-tweet')).toHaveCount(0)

      // Enter the preload margin, while the tweet container is still offscreen.
      await page.locator('footer h2 + div').evaluate(container => {
        window.scrollBy(
          0,
          container.getBoundingClientRect().top - innerHeight - 50,
        )
      })
      await expect(page.getByTestId('rendered-tweet')).toHaveText([
        '1266490485650198528',
        '1267934678784389121',
        '1246110709005660163',
        '1279431298990379012',
      ])
      await page.evaluate(() => window.scrollTo(0, 0))
      await page
        .locator('#language')
        .selectOption(locale === 'en' ? 'es' : 'en')
      await expect(page.locator('#language')).toHaveValue(
        locale === 'en' ? 'es' : 'en',
      )
      await revealNews(page)
      await expect(page.getByTestId('rendered-tweet')).toHaveCount(4)
      expect(requests).toHaveLength(1)
      await expect(
        page.locator('script[src="https://platform.twitter.com/widgets.js"]'),
      ).toHaveCount(1)
    })
  }

  test(`${locale}: navigation before proximity does not load abandoned tweets`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 600 })
    let requests = 0
    await page.route(widgetsURL, route => {
      requests++
      return route.fulfill({
        contentType: 'application/javascript',
        body: widgetsScript,
      })
    })
    await page.goto(locale === 'en' ? '/en' : '/')
    await createRoomFromHome(page, locale, `Deferred tweets ${locale}`)
    await page.waitForTimeout(3200)
    expect(requests).toBe(0)
    await expect(page.getByTestId('rendered-tweet')).toHaveCount(0)
    await revealNews(page)
    await expect(page.getByTestId('rendered-tweet')).toHaveCount(4)
    expect(requests).toBe(1)
    await page.goBack()
    await expect(page.locator('#create-room')).toBeVisible()
    await revealNews(page)
    await expect(page.getByTestId('rendered-tweet')).toHaveCount(4)
    expect(requests).toBe(1)
  })

  test(`${locale}: initially visible tweets load without a scroll or timer`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 1400 })
    await page.route(widgetsURL, route =>
      route.fulfill({
        contentType: 'application/javascript',
        body: widgetsScript,
      }),
    )
    await page.goto(locale === 'en' ? '/en' : '/')
    await expect(page.getByTestId('rendered-tweet')).toHaveCount(4)
    expect(await page.evaluate(() => scrollY)).toBe(0)
  })
}

test('browsers without IntersectionObserver retain eager tweets', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Reflect.deleteProperty(window, 'IntersectionObserver')
  })
  await page.route(widgetsURL, route =>
    route.fulfill({
      contentType: 'application/javascript',
      body: widgetsScript,
    }),
  )
  await page.goto('/')
  await expect(page.getByTestId('rendered-tweet')).toHaveCount(4)
})
