import { Locator, Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { BACKGROUND_CELL_VALUES } from '../../utils/constants'

const copy = {
  es: {
    room: 'Nombre de la sala *',
    create: 'Crear sala',
    setup: 'Preparar sala',
    name: 'Nombre *',
    add: 'Agregar persona',
    host: 'Dirige el juego',
    start: 'Empezar partida',
    play: 'Jugar',
    close: 'Cerrar',
    tutorial: 'Ver tutorial',
  },
  en: {
    room: 'Room name *',
    create: 'Create room',
    setup: 'Set up room',
    name: 'Name *',
    add: 'Add player',
    host: 'Host',
    start: 'Start game',
    play: 'Play',
    close: 'Close',
    tutorial: 'Watch tutorial',
  },
}

async function expectNoOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const root = document.documentElement
        return root.scrollWidth <= root.clientWidth + 1
      }),
    )
    .toBe(true)
}

async function expectVisibleFocus(cell: Locator) {
  await expect(cell).toBeFocused()
  const focus = await cell.evaluate(element => {
    const style = getComputedStyle(element)
    return {
      visible: element.matches(':focus-visible'),
      color: style.outlineColor,
      style: style.outlineStyle,
      width: parseFloat(style.outlineWidth),
    }
  })
  expect(focus.visible).toBe(true)
  expect(focus.style).toBe('solid')
  expect(focus.width).toBeGreaterThanOrEqual(2)
  expect(focus.color).not.toBe('rgba(0, 0, 0, 0)')

  const frame = await cell.evaluate(element => {
    const outer = getComputedStyle(element)
    const inner = getComputedStyle(element, '::after')
    const context = document.createElement('canvas').getContext('2d')!
    const luminance = (color: string) => {
      context.fillStyle = color
      context.fillRect(0, 0, 1, 1)
      const rgb = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3)
      const linear = rgb.map(value => {
        const s = value / 255
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      })
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
    }
    const colors = [outer.outlineColor, inner.outlineColor].map(luminance)
    return {
      forced: matchMedia('(forced-colors: active)').matches,
      display: inner.display,
      style: inner.outlineStyle,
      color: inner.outlineColor,
      border: outer.borderColor,
      pointerEvents: inner.pointerEvents,
      contrast: (Math.max(...colors) + 0.05) / (Math.min(...colors) + 0.05),
    }
  })
  if (frame.forced) {
    expect(frame.display).toBe('none')
  } else {
    expect(frame.style).toBe('solid')
    expect(frame.color).not.toBe(frame.border)
    expect(frame.contrast).toBeGreaterThanOrEqual(7)
    expect(frame.pointerEvents).toBe('none')
  }
}

for (const language of ['es', 'en'] as const) {
  const text = copy[language]

  test(`${language} mobile fields, fluid heading and modal gutter`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(language === 'es' ? '/' : '/en')
    await expect(page.locator('.cb-ad-reservation')).toHaveCount(0)
    // Headless Chromium's overlay scrollbar can hide a missing compiled rule.
    await expect(page.locator('html')).toHaveCSS('scrollbar-gutter', 'stable')
    for (const control of await page.locator('input, select').all()) {
      expect(
        await control.evaluate(element =>
          parseFloat(getComputedStyle(element).fontSize),
        ),
      ).toBeGreaterThanOrEqual(16)
    }

    let previous = 0
    for (const width of [320, 390, 639, 640, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 })
      const size = await page
        .locator('.cb-home-intro')
        .evaluate(element => parseFloat(getComputedStyle(element).fontSize))
      expect(size).toBeGreaterThanOrEqual(previous)
      if (width === 640) expect(size - previous).toBeLessThan(0.1)
      previous = size
      await expectNoOverflow(page)
    }

    // ReactModal hides the page from the accessibility tree while open.
    const brand = page.locator('.cb-brand')
    const before = await brand.boundingBox()
    await page.getByRole('button', { name: text.tutorial, exact: true }).click()
    const after = await brand.boundingBox()
    expect(before).not.toBeNull()
    expect(after).not.toBeNull()
    expect(Math.abs(after!.x - before!.x)).toBeLessThanOrEqual(1)
    await page.getByRole('button', { name: text.close, exact: true }).click()

    // A larger default font must still enlarge the heading and form controls.
    await page.setViewportSize({ width: 390, height: 844 })
    const heading = page.locator('.cb-home-intro')
    const normalSize = await heading.evaluate(element =>
      parseFloat(getComputedStyle(element).fontSize),
    )
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '32px'
    })
    expect(
      await heading.evaluate(element =>
        parseFloat(getComputedStyle(element).fontSize),
      ),
    ).toBeGreaterThanOrEqual(normalSize * 2)
    await expect(page.locator('#name')).toHaveCSS('font-size', '32px')
  })

  test(`${language} long names, keyboard card focus and scrollable dialogs`, async ({
    page,
  }) => {
    const name = 'FernandezDeLaFamilia'.repeat(3)
    await page.setViewportSize({ width: 320, height: 740 })
    await page.goto(language === 'es' ? '/' : '/en')
    await page.getByRole('textbox', { name: text.room, exact: true }).fill(name)
    await page.getByRole('button', { name: text.create, exact: true }).click()
    await expect(page.getByRole('heading', { name: text.setup })).toBeVisible()
    for (const player of [name, 'Ana Maria de la Familia Fernandez']) {
      await page
        .getByRole('textbox', { name: text.name, exact: true })
        .fill(player)
      await page.getByRole('button', { name: text.add, exact: true }).click()
    }
    await page
      .getByRole('combobox', { name: text.host, exact: true })
      .selectOption({ label: name })
    await expectNoOverflow(page)
    const remove = page.locator('#remove-player-1')
    const removeBox = await remove.boundingBox()
    expect(removeBox!.x + removeBox!.width).toBeLessThanOrEqual(320)
    await page.getByRole('button', { name: text.start, exact: true }).click()
    await expect(page.getByTestId('player-row')).toHaveCount(2)
    const row = page.getByTestId('player-row').filter({ hasText: name })
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 844 })
      await expectNoOverflow(page)
      const bounds = await row
        .getByRole('button', { name: text.play, exact: true })
        .boundingBox()
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width)
    }
    await row.getByRole('button', { name: text.play, exact: true }).click()
    const card = page.getByTestId('bingo-card').first()
    await expect(card).toBeVisible()
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 844 })
      await expectNoOverflow(page)
    }
    const cells = card.getByRole('button')
    await cells.first().focus()
    await page.keyboard.press('Tab')
    const focused = cells.nth(1)
    await expectVisibleFocus(focused)
    await focused.press('Enter')
    await expect(focused).toHaveAttribute('aria-pressed', 'true')
    await expectVisibleFocus(focused)
    await page.emulateMedia({ forcedColors: 'active' })
    await expectVisibleFocus(focused)
    await page.emulateMedia({ forcedColors: 'none' })

    // Themes decorate empty cells. Exercise the actual saved preference and
    // keyboard marking beside every catalog theme and a custom image URL.
    for (const [index, background] of [
      ...BACKGROUND_CELL_VALUES,
      { type: 'url', value: '/background-cells/kun-aguero.jpg' },
    ].entries()) {
      await page.setViewportSize({ width: index % 2 ? 320 : 1280, height: 900 })
      await page.evaluate(({ type, value }) => {
        const playerId = location.pathname.split('/').pop()!
        localStorage.setItem(
          'backgroundCell',
          JSON.stringify({ [playerId]: { type, value } }),
        )
      }, background)
      await page.reload()
      await expect(card).toBeVisible()
      if (background.type !== 'color') {
        await expect(
          card.locator('.cb-ticket-cell--empty').first(),
        ).not.toHaveCSS('background-image', 'none')
      }
      await cells.first().focus()
      await page.keyboard.press('Tab')
      await expectVisibleFocus(focused)
      const wasMarked = await focused.getAttribute('aria-pressed')
      await focused.press('Enter')
      await expect(focused).toHaveAttribute(
        'aria-pressed',
        wasMarked === 'true' ? 'false' : 'true',
      )
      await expectVisibleFocus(focused)
      await expectNoOverflow(page)
    }

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 844, height: 390 },
      { width: 1280, height: 900 },
    ]) {
      await page.setViewportSize(viewport)
      const trigger = page.locator('#configure-empty-cells:visible')
      await trigger.click()
      const dialog = page.getByRole('dialog')
      const close = dialog.getByRole('button', {
        name: text.close,
        exact: true,
      })
      const initial = await close.boundingBox()
      await dialog.locator('#background').scrollIntoViewIfNeeded()
      const scrolled = await close.boundingBox()
      expect(Math.abs(scrolled!.y - initial!.y)).toBeLessThanOrEqual(1)
      expect(scrolled!.y).toBeGreaterThanOrEqual(0)
      expect(scrolled!.width).toBeGreaterThanOrEqual(44)
      expect(scrolled!.height).toBeGreaterThanOrEqual(44)
      await expect(close).toBeInViewport()
      await expect(dialog.locator('#background')).toBeInViewport()
      await close.click()
      await expect(dialog).toHaveCount(0)
      await expect(trigger).toBeFocused()
    }
  })
}
