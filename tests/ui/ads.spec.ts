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
      {
        const frame = document.createElement('iframe');
        frame.title = 'Simulated advertisement';
        frame.width = String(node.getBoundingClientRect().width);
        node.style.width = frame.width + 'px';
        frame.height = '90';
        frame.style.border = '0';
        frame.srcdoc = ${JSON.stringify(outcome)} === 'unfilled'
          ? '' : '<p>Simulated advertisement</p>';
        node.appendChild(frame);
        node.dataset.adStatus = ${JSON.stringify(outcome)};
      }
    }};
  `
}

async function contentTop(page: Page) {
  return page
    .locator('.cb-layout-main')
    .evaluate(node => node.getBoundingClientRect().top)
}

async function expectCollapsed(page: Page) {
  await expect(page.locator(reservation)).toHaveCount(0)
  await expect
    .poll(() =>
      page.evaluate(() => {
        const header = document.querySelector('.cb-header')!
        const content = document.querySelector('.cb-layout-main')!
        return (
          content.getBoundingClientRect().top -
          header.getBoundingClientRect().bottom
        )
      }),
    )
    .toBe(0)
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

async function expectNoOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    )
    .toBe(0)
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

    // A frozen creative must not make the document wider than the viewport.
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
      await expectNoOverflow(page)
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

for (const outcome of ['filled', 'unfill-optimized']) {
  test(`${outcome}: hides the whole oversized unit and restores the same iframe when it fits`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.route(scriptURL, route =>
      route.fulfill({
        contentType: 'application/javascript',
        body: sdk(outcome),
      }),
    )
    await page.goto('/')
    const frame = page.locator(`${ad} iframe`)
    await expect(frame).toBeVisible()
    await expect(frame).toHaveAttribute('width', '728')
    const retained = await frame.elementHandle()
    for (const width of [390, 320, 844, 390, 1280]) {
      await page.setViewportSize({ width, height: 844 })
      if (width < 760) {
        await expect(page.locator(ad)).toHaveAttribute(
          'data-ad-overflow',
          'true',
        )
        await expect(frame).toBeHidden()
      } else {
        await expect(frame).toBeVisible()
        await expect(page.locator(ad)).not.toHaveAttribute('data-ad-overflow')
      }
      await expectNoOverflow(page)
      await expect(page.locator(reservation)).toHaveCSS('height', '90px')
      expect(await retained!.evaluate(node => node.isConnected)).toBe(true)
      await expect(frame).toHaveAttribute('width', '728')
      await expectRequests(page, 1)
    }
    expect(errors).toEqual([])
  })
}

test('late SDK iframe size changes are checked even while the unit is hidden', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route(scriptURL, route =>
    route.fulfill({ contentType: 'application/javascript', body: sdk() }),
  )
  await page.goto('/')
  const frame = page.locator(`${ad} iframe`)
  await expect(frame).toBeVisible()
  const top = await contentTop(page)
  // The SDK can change its iframe without changing the outer ins dimensions.
  await frame.evaluate(node => node.setAttribute('width', '728'))
  await expect(frame).toBeHidden()
  await expectNoOverflow(page)
  await frame.evaluate(node => node.setAttribute('width', '280'))
  await expect(frame).toBeVisible()
  await frame.evaluate(node => node.setAttribute('height', '280'))
  await expect(frame).toBeHidden()
  await frame.evaluate(node => node.setAttribute('height', '90'))
  await expect(frame).toBeVisible()
  expect(await contentTop(page)).toBe(top)
  await expectRequests(page, 1)
})

for (const outcome of ['unfilled', 'error']) {
  for (const locale of ['es', 'en']) {
    test(`${locale} ${outcome}: removes the whole gap and preserves form input`, async ({
      page,
    }) => {
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      let release!: () => void
      const gate = new Promise<void>(resolve => {
        release = resolve
      })
      await page.setViewportSize({ width: 1280, height: 844 })
      await page.route(scriptURL, async route => {
        await gate
        await route.fulfill({
          contentType: 'application/javascript',
          body: sdk(outcome),
        })
      })
      await page.goto(locale === 'en' ? '/en' : '/', {
        waitUntil: 'domcontentloaded',
      })
      await page.locator('#name').fill('Ad failure')
      const top = await contentTop(page)
      release()
      await expectRequests(page, 1)
      await expectCollapsed(page)
      expect(top - (await contentTop(page))).toBe(106)
      await expect(page.locator('#name')).toHaveValue('Ad failure')
      await expect(page.locator('#name')).toBeFocused()
      await expect(page.locator('#create-room')).toBeEnabled()
      await page.setViewportSize({ width: 390, height: 844 })
      await expectCollapsed(page)
      await expectNoOverflow(page)
      await expectRequests(page, 1)
      expect(errors).toEqual([])
    })
  }
}

test('unfill-optimized content remains visible inside the reservation', async ({
  page,
}) => {
  await page.route(scriptURL, route =>
    route.fulfill({
      contentType: 'application/javascript',
      body: sdk('unfill-optimized'),
    }),
  )
  await page.goto('/')
  await expect(page.locator(`${ad} iframe`)).toBeVisible()
  await expect(page.locator(reservation)).toHaveCSS('height', '90px')
  await expectRequests(page, 1)
})

for (const width of [390, 1280]) {
  test(`blocked SDK at ${width}px removes the entire gap and no request is queued`, async ({
    page,
  }, testInfo) => {
    let loads = 0
    await page.setViewportSize({ width, height: 844 })
    await page.route(scriptURL, route => {
      loads++
      return route.abort('blockedbyclient')
    })
    await page.goto('/')
    await expect.poll(() => loads).toBe(1)
    await expectCollapsed(page)
    await expect(page.locator(ad)).toHaveCount(0)
    expect(await page.evaluate(() => 'adsbygoogle' in window)).toBe(false)
    await testInfo.attach(`blocked-${width}-es`, {
      body: await page.screenshot(),
      contentType: 'image/png',
    })
    await page
      .getByRole('combobox', { name: 'Idioma', exact: true })
      .selectOption('en')
    await expect(page).toHaveURL(/\/en$/)
    await expectCollapsed(page)
    await expect(page.locator(ad)).toHaveCount(0)
    await expectNoOverflow(page)
    await testInfo.attach(`blocked-${width}-en`, {
      body: await page.screenshot(),
      contentType: 'image/png',
    })
    expect(loads).toBe(1)
  })
}

test('silent SDK times out and a late load cannot reopen the gap on navigation', async ({
  page,
}) => {
  await page.clock.install()
  let release!: () => void
  const gate = new Promise<void>(resolve => {
    release = resolve
  })
  await page.route(scriptURL, async route => {
    await gate
    await route.fulfill({ contentType: 'application/javascript', body: sdk() })
  })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.locator('#name').fill('Keep my input')
  await page.clock.fastForward(3_000)
  await expect(page.locator(reservation)).toHaveCSS('height', '90px')
  await page.clock.fastForward(3_000)
  await expectCollapsed(page)
  release()
  await expectRequests(page, 0)
  await page.clock.fastForward(20_000)
  await expectCollapsed(page)
  await expect(page.locator('#name')).toHaveValue('Keep my input')
  await page.locator('#language').selectOption('en')
  await expect(page).toHaveURL(/\/en$/)
  await expectCollapsed(page)
  await expectRequests(page, 0)
})

test('silent slot times out without retry or late reinsertion', async ({
  page,
}) => {
  await page.clock.install()
  await page.route(scriptURL, route =>
    route.fulfill({
      contentType: 'application/javascript',
      body: sdk('pending'),
    }),
  )
  await page.goto('/')
  await expectRequests(page, 1)
  const retained = await page.locator(ad).elementHandle()
  await page.clock.fastForward(3_000)
  await expect(page.locator(reservation)).toHaveCSS('height', '90px')
  await page.clock.fastForward(3_000)
  await expectCollapsed(page)
  await retained!.evaluate(node =>
    node.setAttribute('data-ad-status', 'filled'),
  )
  await page.clock.fastForward(20_000)
  await expectCollapsed(page)
  await expectRequests(page, 1)
})

for (const outcome of ['filled', 'unfill-optimized']) {
  test(`${outcome}: delayed slot response cancels the empty-slot deadline`, async ({
    page,
  }) => {
    await page.clock.install()
    await page.route(scriptURL, route =>
      route.fulfill({
        contentType: 'application/javascript',
        body: sdk('pending'),
      }),
    )
    await page.goto('/')
    await expectRequests(page, 1)
    await page.clock.fastForward(3_000)
    await page
      .locator(ad)
      .evaluate(
        (node, status) => node.setAttribute('data-ad-status', status),
        outcome,
      )
    await expect(page.locator(ad)).toHaveAttribute('data-ad-status', outcome)
    await page.clock.fastForward(20_000)
    await expect(page.locator(`${ad} iframe`)).toBeVisible()
    await expect(page.locator(reservation)).toHaveCSS('height', '90px')
    await expectRequests(page, 1)
  })
}

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
