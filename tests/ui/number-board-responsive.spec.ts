import { test, expect } from './fixtures'
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
