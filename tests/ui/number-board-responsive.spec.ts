import { test, expect } from './fixtures'
import { firestorePort, projectId } from './environment'
import { createReadyRoom, testPlayerNames } from './room-setup'

test('number board keeps ten numbers per row across responsive widths', async ({
  page,
}, testInfo) => {
  await createReadyRoom(page, 'QA bolillero responsive')
  await page
    .getByTestId('player-row')
    .filter({ hasText: testPlayerNames.host })
    .getByRole('button', { name: 'Jugar', exact: true })
    .click()
  const board = page.locator('#ticket-numbers:visible')
  await expect(board.getByRole('button')).toHaveCount(90)

  await page.setViewportSize({ width: 390, height: 844 })
  const lastNumber = board.getByRole('button', { name: '90', exact: true })
  await lastNumber.click()
  await expect(page.getByTestId('called-number')).toHaveText(['90'])

  for (const locale of ['es', 'en']) {
    if (locale === 'en') {
      await page
        .getByRole('combobox', { name: 'Idioma', exact: true })
        .selectOption('en')
      await expect(page).toHaveURL(/\/en\/room\//)
      await expect(lastNumber).toHaveClass(/cb-number-board-cell--called/)
    }
    for (const width of [
      390,
      320,
      360,
      375,
      639,
      640,
      767,
      768,
      1023,
      1024,
      1280,
    ]) {
      await page.setViewportSize({ width, height: 844 })
      const geometry = await board.evaluate(element => {
        const bounds = element.getBoundingClientRect()
        const buttons = Array.from(element.querySelectorAll('button'))
        const cells = buttons.map(button => button.getBoundingClientRect())
        const rows = new Map<number, number>()
        cells.forEach(cell => rows.set(cell.top, (rows.get(cell.top) || 0) + 1))
        return {
          width: bounds.width,
          rows: Array.from(rows.values()),
          minCellWidth: Math.min(...cells.map(cell => cell.width)),
          withinBoard: cells.every(
            cell => cell.left >= bounds.left && cell.right <= bounds.right + 1,
          ),
          labelsWithinCells: buttons.every((button, index) => {
            const label = button.querySelector('span')!.getBoundingClientRect()
            return (
              label.left >= cells[index].left &&
              label.right <= cells[index].right + 1
            )
          }),
          noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
        }
      })
      console.log({ locale, viewport: width, ...geometry })
      expect(geometry.rows, `rows at ${width}px`).toEqual(Array(9).fill(10))
      expect(geometry.minCellWidth).toBeGreaterThanOrEqual(24)
      expect(geometry.withinBoard).toBe(true)
      expect(geometry.labelsWithinCells).toBe(true)
      expect(geometry.noOverflow).toBe(true)
    }
    await page.setViewportSize({ width: 320, height: 844 })
    await testInfo.attach(`number-board-mobile-${locale}`, {
      body: await board.screenshot({
        animations: 'disabled',
        style: '.Toastify { visibility: hidden; }',
      }),
      contentType: 'image/png',
    })
  }
  await lastNumber.click()
  await expect(page.getByTestId('called-number')).toHaveCount(0)
})

for (const locale of ['es', 'en']) {
  test(`${locale} responsive controls keep identity and dialog focus`, async ({
    page: host,
    playerPage: player,
  }, testInfo) => {
    await createReadyRoom(host, 'Responsive controls', {
      useOnlineCaller: true,
    })
    const lobby = host.url()
    await player.goto(lobby)
    await player
      .getByTestId('player-row')
      .filter({ hasText: testPlayerNames.player })
      .getByRole('button', { name: 'Jugar', exact: true })
      .click()
    await host
      .getByTestId('player-row')
      .filter({ hasText: testPlayerNames.host })
      .getByRole('button', { name: 'Jugar', exact: true })
      .click()
    for (const page of [host, player]) {
      await expect(page.getByTestId('bingo-card')).toHaveCount(2)
    }
    if (locale === 'en') {
      for (const page of [host, player]) {
        await page
          .getByRole('combobox', { name: 'Idioma', exact: true })
          .selectOption('en')
        await expect(page).toHaveURL(/\/en\/room\//)
      }
    }
    for (const width of [320, 768, 1023, 1024, 1280]) {
      await host.setViewportSize({ width, height: 800 })
      await expect(host.locator('#ticket-numbers:visible')).toBeVisible()
      await testInfo.attach(`controls-${locale}-${width}`, {
        body: await host
          .locator('.cb-game-table')
          .screenshot({ animations: 'disabled' }),
        contentType: 'image/png',
      })
    }
    // The same opener and dialog must survive both directions across lg.
    for (const [from, to] of [
      [390, 1280],
      [1280, 390],
    ]) {
      await host.setViewportSize({ width: from, height: 844 })
      const trigger = host.locator('#configure-empty-cells')
      await trigger.focus()
      await host.keyboard.press('Enter')
      const dialog = host.getByRole('dialog')
      await expect(dialog).toBeVisible()
      const field = dialog.locator('#background')
      await field.fill('/background-cells/kun-aguero.jpg')
      await host.setViewportSize({ width: to, height: 844 })
      await expect(dialog).toBeVisible()
      await expect(field).toHaveValue('/background-cells/kun-aguero.jpg')
      await host.keyboard.press('Escape')
      await expect(dialog).toHaveCount(0)
      await expect(trigger).toBeVisible()
      await expect(trigger).toBeFocused()
    }
    for (const page of [host, player]) {
      await expect(page.locator('#ticket-numbers')).toHaveCount(1)
      await expect(page.locator('#configure-empty-cells')).toHaveCount(1)
    }
    for (const id of ['next-number', 'celebrations', 'sounds', 'reboot-game']) {
      await expect(host.locator(`#${id}`)).toHaveCount(1)
    }
    await host.locator('#next-number').click()
    await expect(host.getByTestId('called-number')).toHaveCount(1)
    await expect(player.getByTestId('called-number')).toHaveCount(1)

    // Streamer mode has no setup control; enable it only in the owned emulator.
    const roomId = new URL(lobby).pathname.split('/').pop()!
    const response = await fetch(
      `http://127.0.0.1:${firestorePort}/v1/projects/${projectId}/databases/(default)/documents/rooms/${roomId}?updateMask.fieldPaths=streamerView`,
      {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fields: { streamerView: { booleanValue: true } },
        }),
      },
    )
    expect(response.ok, 'Streamer seed accepted by local emulator').toBe(true)
    await expect(host.getByTestId('bingo-card')).toHaveCount(0)
    await expect(player.getByTestId('bingo-card')).toHaveCount(2)
    for (const width of [320, 1023, 1024, 1280]) {
      await host.setViewportSize({ width, height: 800 })
      await expect(host.locator('#ticket-numbers')).toBeVisible()
      await expect(host.locator('#ticket-numbers button')).toHaveCount(90)
      const layout = await host.locator('.cb-game-table').evaluate(table => {
        const bounds = table.getBoundingClientRect()
        const parent = table.parentElement!.getBoundingClientRect()
        return {
          ratio: bounds.width / parent.width,
          centered:
            Math.abs(
              bounds.left - parent.left - (parent.width - bounds.width) / 2,
            ) < 2,
          noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
        }
      })
      expect(layout.ratio).toBeCloseTo(width >= 1024 ? 2 / 3 : 1, 2)
      expect(layout.centered).toBe(true)
      expect(layout.noOverflow).toBe(true)
      await testInfo.attach(`streamer-${locale}-${width}`, {
        body: await host
          .locator('.cb-game-table')
          .screenshot({ animations: 'disabled' }),
        contentType: 'image/png',
      })
    }
  })
}
