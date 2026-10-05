import { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { createReadyRoom, testPlayerNames } from './room-setup'

const scriptURL = '**://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
const reservation = '.cb-ad-reservation'
const ad = 'ins.adsbygoogle'

function sdk(outcome = 'filled') {
  return `
    document.documentElement.dataset.adRequests = '0';
    window.adsbygoogle = { push() {
      const root = document.documentElement;
      root.dataset.adRequests = String(Number(root.dataset.adRequests) + 1);
      const node = document.querySelector('ins.adsbygoogle:not([data-adsbygoogle-status])');
      if (!node || !node.isConnected || node.getBoundingClientRect().width <= 0) {
        root.dataset.invalidAdRequest = 'true';
        throw new Error('Invalid ad target');
      }
      node.dataset.adsbygoogleStatus = 'done';
      if (${JSON.stringify(
        outcome,
      )} === 'error') throw new Error('SDK failure');
      node.dataset.adStatus = ${JSON.stringify(outcome)};
      if (${JSON.stringify(outcome)} === 'unfilled') {
        node.style.display = 'none';
      } else {
        const frame = document.createElement('iframe');
        frame.title = 'Simulated advertisement';
        frame.width = String(node.getBoundingClientRect().width);
        frame.height = '90';
        frame.style.border = '0';
        frame.srcdoc = '<p>Simulated advertisement</p>';
        node.appendChild(frame);
      }
    }};
  `
}

async function contentTop(page: Page) {
  return page
    .locator('.cb-layout-main')
    .evaluate(node => node.getBoundingClientRect().top)
}

async function expectRequests(page: Page, count: number) {
  await expect(page.locator('html')).toHaveAttribute(
    'data-ad-requests',
    String(count),
  )
  await expect(page.locator('html')).not.toHaveAttribute(
    'data-invalid-ad-request',
    'true',
  )
}

for (const locale of ['es', 'en']) {
  test(`${locale}: reserves space before SDK readiness and requests once across resize`, async ({
    page,
  }, testInfo) => {
    let release!: () => void
    const gate = new Promise<void>(resolve => {
      release = resolve
    })
    await page.route(scriptURL, async route => {
      await gate
      await route.fulfill({
        contentType: 'application/javascript',
        body: sdk(),
      })
    })
    await page.setViewportSize({ width: 390, height: 844 })
    const response = await page.goto(locale === 'en' ? '/en' : '/', {
      waitUntil: 'domcontentloaded',
    })
    const html = await response!.text()
    expect(html).toContain('cb-ad-reservation')
    expect(html).not.toContain('<ins')
    await expect(page.locator(reservation)).toHaveCSS('height', '90px')
    await expect(page.locator(ad)).toHaveCount(0)
    await page.evaluate(() => document.fonts.ready)
    const top = await contentTop(page)
    release()
    await expect(page.locator(`${ad} iframe`)).toHaveCount(1)
    await expectRequests(page, 1)
    expect(await contentTop(page)).toBe(top)
    await testInfo.attach(`${locale}-ad-mobile`, {
      body: await page.screenshot(),
      contentType: 'image/png',
    })
    await expect(page.locator(ad)).not.toHaveAttribute('data-ad-format')
    await expect(page.locator(ad)).not.toHaveAttribute(
      'data-full-width-responsive',
    )

    // Only the application's slot is asserted. A real frozen creative may overflow.
    for (const width of [
      320,
      360,
      375,
      414,
      759,
      760,
      761,
      768,
      1024,
      1280,
      1440,
      390,
    ]) {
      await page.setViewportSize({ width, height: 844 })
      const size = await page.locator(reservation).evaluate(node => ({
        slot: node.getBoundingClientRect().width,
        parent: node.parentElement!.getBoundingClientRect().width,
        height: node.getBoundingClientRect().height,
      }))
      expect(size.slot).toBeLessThanOrEqual(Math.min(size.parent, 728))
      expect(size.height).toBe(90)
      if (width === 1280) {
        await testInfo.attach(`${locale}-ad-desktop`, {
          body: await page.screenshot(),
          contentType: 'image/png',
        })
      }
    }
    await expectRequests(page, 1)
  })
}

for (const outcome of ['unfilled', 'error']) {
  test(`${outcome}: retains the reservation without retrying or breaking controls`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.route(scriptURL, route =>
      route.fulfill({
        contentType: 'application/javascript',
        body: sdk(outcome),
      }),
    )
    await page.goto('/')
    await expectRequests(page, 1)
    await expect(page.locator(reservation)).toHaveCSS('height', '90px')
    const top = await contentTop(page)
    await page
      .getByRole('textbox', { name: 'Nombre de la sala *', exact: true })
      .fill('Ad failure')
    await page.setViewportSize({ width: 390, height: 844 })
    await expectRequests(page, 1)
    expect(await contentTop(page)).toBe(top)
    await expect(
      page.getByRole('button', { name: 'Crear sala', exact: true }),
    ).toBeEnabled()
    expect(errors).toEqual([])
  })
}

test('blocked SDK leaves only the reserved space and no queued request', async ({
  page,
}) => {
  let loads = 0
  await page.route(scriptURL, route => {
    loads++
    return route.abort('failed')
  })
  await page.goto('/')
  await expect.poll(() => loads).toBe(1)
  await expect(page.locator(reservation)).toHaveCSS('height', '90px')
  await expect(page.locator(ad)).toHaveCount(0)
  expect(await page.evaluate(() => 'adsbygoogle' in window)).toBe(false)
  await page
    .getByRole('combobox', { name: 'Idioma', exact: true })
    .selectOption('en')
  await expect(page).toHaveURL(/\/en$/)
  await expect(page.locator(reservation)).toHaveCSS('height', '90px')
  await expect(page.locator(ad)).toHaveCount(0)
  expect(loads).toBe(1)
})

test('waits for positive width and stops observing after the request', async ({
  page,
}) => {
  let release!: () => void
  const gate = new Promise<void>(resolve => {
    release = resolve
  })
  await page.route(scriptURL, async route => {
    await gate
    await route.fulfill({ contentType: 'application/javascript', body: sdk() })
  })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const hidden = await page.addStyleTag({
    content: `${reservation} { width: 0 !important; }`,
  })
  release()
  await expect(page.locator(ad)).toHaveCount(1)
  await expectRequests(page, 0)
  await hidden.evaluate(node => node.parentNode?.removeChild(node))
  await expectRequests(page, 1)
  const hiddenAgain = await page.addStyleTag({
    content: `${reservation} { display: none; }`,
  })
  await hiddenAgain.evaluate(node => node.parentNode?.removeChild(node))
  await page.setViewportSize({ width: 390, height: 844 })
  await expectRequests(page, 1)
})

test('late SDK requests only the current route, then initializes each new node once', async ({
  page,
}) => {
  let loads = 0
  let release!: () => void
  const gate = new Promise<void>(resolve => {
    release = resolve
  })
  await page.route(scriptURL, async route => {
    loads++
    await gate
    await route.fulfill({ contentType: 'application/javascript', body: sdk() })
  })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const first = await page.locator(reservation).elementHandle()
  await page
    .getByRole('textbox', { name: 'Nombre de la sala *', exact: true })
    .fill('PERF-09 navigation')
  await page.getByRole('button', { name: 'Crear sala', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Preparar sala' }),
  ).toBeVisible()
  expect(await first!.evaluate(node => node.isConnected)).toBe(false)
  await expect(page.locator(ad)).toHaveCount(0)
  release()
  await expectRequests(page, 1)
  await expect(page.locator(`${ad} iframe`)).toHaveCount(1)
  await page.goBack()
  await expect(
    page.getByRole('textbox', { name: 'Nombre de la sala *', exact: true }),
  ).toBeVisible()
  await expectRequests(page, 2)
  await page.goForward()
  await expect(
    page.getByRole('heading', { name: 'Preparar sala' }),
  ).toBeVisible()
  await expectRequests(page, 3)
  const retained = await page.locator(ad).elementHandle()
  await page
    .getByRole('combobox', { name: 'Idioma', exact: true })
    .selectOption('en')
  await expect(page.getByRole('heading', { name: 'Set up room' })).toBeVisible()
  expect(await retained!.evaluate(node => node.isConnected)).toBe(true)
  await expectRequests(page, 3)
  expect(loads).toBe(1)
})

test('host draws and player marks do not refresh filled ads', async ({
  page: host,
  playerPage: player,
}) => {
  for (const page of [host, player]) {
    await page.route(scriptURL, route =>
      route.fulfill({ contentType: 'application/javascript', body: sdk() }),
    )
  }
  await createReadyRoom(host, 'PERF-09 game', { useOnlineCaller: true })
  await player.goto(host.url())
  for (const [page, name] of [
    [host, testPlayerNames.host],
    [player, testPlayerNames.player],
  ] as const) {
    await page
      .getByTestId('player-row')
      .filter({ hasText: name })
      .getByRole('button', { name: 'Jugar', exact: true })
      .click()
    await expect(page.getByTestId('bingo-card')).toHaveCount(2)
    await expect(page.locator(`${ad} iframe`)).toHaveCount(1)
  }
  const hostRequests = Number(
    await host.locator('html').getAttribute('data-ad-requests'),
  )
  const playerRequests = Number(
    await player.locator('html').getAttribute('data-ad-requests'),
  )
  await host.getByRole('button', { name: 'Próximo número' }).click()
  await expect(player.getByTestId('called-number')).toHaveCount(1)
  const number = player
    .getByTestId('bingo-card')
    .first()
    .getByRole('button')
    .first()
  await number.click()
  await expect(number).toHaveAttribute('aria-pressed', 'true')
  await number.click()
  await expect(number).toHaveAttribute('aria-pressed', 'false')
  await expectRequests(host, hostRequests)
  await expectRequests(player, playerRequests)
})

test('SDK ready on a page without a manual slot initializes the next page once', async ({
  page,
}) => {
  let loads = 0
  await page.route(scriptURL, route => {
    loads++
    return route.fulfill({ contentType: 'application/javascript', body: sdk() })
  })
  await page.goto('/perf-09-missing-page')
  await expect(page.locator(reservation)).toHaveCount(0)
  await expectRequests(page, 0)
  await page.evaluate(() => {
    const nextWindow = window as typeof window & {
      next: { router: { push: (path: string) => Promise<boolean> } }
    }
    return nextWindow.next.router.push('/')
  })
  await expect(page.locator(`${ad} iframe`)).toHaveCount(1)
  await expectRequests(page, 1)
  expect(loads).toBe(1)
})
