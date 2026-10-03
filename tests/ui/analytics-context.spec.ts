import { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { baseURL } from './environment'

const commands = (page: Page) =>
  page.evaluate(() => {
    const analyticsWindow = window as Window & { dataLayer?: unknown[][] }
    return (analyticsWindow.dataLayer || []).map(command => Array.from(command))
  })

test('compiled bootstrap protects direct room URLs before loading Google', async ({
  page,
}) => {
  for (const [path, expectedPath] of [
    ['/room/qa-private-room', '/room/[roomId]'],
    ['/room/qa-private-room/admin', '/room/[roomId]/admin'],
    [
      '/en/room/qa-private-room/qa-private-player',
      '/en/room/[roomId]/[playerId]',
    ],
  ]) {
    const response = await page.goto(
      `${path}?secret=qa-private-query#qa-private-fragment`,
    )
    const html = await response!.text()
    expect(html.indexOf('page_referrer:')).toBeLessThan(
      html.indexOf('googletagmanager.com/gtag/js'),
    )

    await expect
      .poll(
        async () =>
          (await commands(page)).filter(
            ([command, name]) => command === 'event' && name === 'page_view',
          ).length,
      )
      .toBe(1)
    const queued = await commands(page)
    const configs = queued.filter(([command]) => command === 'config')
    expect(configs.length).toBeGreaterThan(0)
    // The first config is executed by the actual server-rendered inline script,
    // before hydration. This also catches serialization/minification failures.
    expect(configs[0]).toEqual([
      'config',
      'G-TEST123',
      {
        send_page_view: false,
        page_location: `${baseURL}${expectedPath}`,
        page_referrer: '',
      },
    ])
    expect(JSON.stringify(queued)).not.toContain('qa-private')
  }
})

test('SPA history and return to home keep automatic-event defaults private', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const observed = window as Window & {
      dataLayer?: unknown[][]
      analyticsHistoryContexts?: unknown[]
    }
    observed.analyticsHistoryContexts = []
    for (const method of ['pushState', 'replaceState'] as const) {
      const changeState = history[method]
      history[method] = function(...args) {
        const configs = (observed.dataLayer || []).filter(
          command => command[0] === 'config',
        )
        observed.analyticsHistoryContexts?.push(
          configs[configs.length - 1]?.[2],
        )
        return changeState.apply(this, args)
      }
    }
  })
  await page.goto(
    '/room/qa-private-room/qa-private-player?secret=qa-private-query',
  )
  await expect
    .poll(
      async () =>
        (await commands(page)).filter(
          ([command, name]) => command === 'event' && name === 'page_view',
        ).length,
    )
    .toBe(1)
  await page
    .getByRole('combobox', { name: 'Idioma', exact: true })
    .selectOption('en')
  await expect(page).toHaveURL(/\/en\/room\//)
  await expect
    .poll(
      async () =>
        (await commands(page)).filter(
          ([command, name]) => command === 'event' && name === 'page_view',
        ).length,
    )
    .toBe(2)

  const historyContexts = await page.evaluate(
    () =>
      (window as Window & { analyticsHistoryContexts?: unknown[] })
        .analyticsHistoryContexts,
  )
  expect(historyContexts).toContainEqual({
    page_location: `${baseURL}/en/room/[roomId]/[playerId]`,
    page_referrer: `${baseURL}/room/[roomId]/[playerId]`,
    send_page_view: false,
    update: true,
  })
  expect(JSON.stringify(await commands(page))).not.toContain('qa-private')

  await page.reload()
  await expect
    .poll(
      async () =>
        (await commands(page)).filter(
          ([command]) => command === 'config',
        )[0]?.[2],
    )
    .toMatchObject({
      page_location: `${baseURL}/en/room/[roomId]/[playerId]`,
      // Reload retains the original direct entry's empty document.referrer.
      page_referrer: '',
    })
  await page.getByRole('link', { name: 'Coronabingo', exact: true }).click()
  await expect(page).toHaveURL(`${baseURL}/en`)
  await expect
    .poll(
      async () =>
        (await commands(page))
          .filter(([command]) => command === 'config')
          .at(-1)?.[2],
    )
    .toMatchObject({
      page_location: `${baseURL}/en`,
      page_referrer: `${baseURL}/en/room/[roomId]/[playerId]`,
    })
  expect(JSON.stringify(await commands(page))).not.toContain('qa-private')
})
