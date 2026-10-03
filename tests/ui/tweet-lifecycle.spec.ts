import { test, expect } from './fixtures'

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
    await expect.poll(() => requests).toBe(1)
    await page
      .getByRole('textbox', {
        name: locale === 'en' ? 'Room name *' : 'Nombre de la sala *',
        exact: true,
      })
      .fill(`Tweet lifecycle ${locale}`)
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
    const links = page.getByRole('link', {
      name: locale === 'en' ? 'View post' : 'Ver publicación',
      exact: true,
    })
    await expect(links).toHaveCount(4)
    await expect(links.first()).toHaveAttribute(
      'href',
      'https://twitter.com/i/web/status/1266490485650198528',
    )
    await page
      .getByRole('textbox', {
        name: locale === 'en' ? 'Room name *' : 'Nombre de la sala *',
        exact: true,
      })
      .fill(`Tweet retry ${locale}`)
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
