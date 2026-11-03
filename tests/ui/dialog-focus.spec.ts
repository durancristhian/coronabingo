import { Locator, Page } from '@playwright/test'
import { test, expect } from './fixtures'

// Traverse the real tab order, including disabled/hidden controls and wrapping.
async function checkDialog(page: Page, dialog: Locator) {
  await expect(dialog).toBeFocused()
  await page.keyboard.press('Tab')
  const first = await page.locator(':focus').elementHandle()
  expect(first).not.toBeNull()
  let wrapped = false
  let tabStops = 0
  for (let step = 0; step < 100; step++) {
    expect(
      await dialog.evaluate(el => el.contains(document.activeElement)),
    ).toBe(true)
    tabStops++
    await page.keyboard.press('Tab')
    if (await first!.evaluate(el => el === document.activeElement)) {
      wrapped = true
      break
    }
  }
  expect(wrapped, 'Tab wraps within the dialog').toBe(true)
  for (let step = 0; step < tabStops; step++) {
    await page.keyboard.press('Shift+Tab')
    expect(
      await dialog.evaluate(el => el.contains(document.activeElement)),
    ).toBe(true)
  }
  expect(await first!.evaluate(el => el === document.activeElement)).toBe(true)
}

for (const language of ['es', 'en'] as const) {
  for (const width of [390, 1280]) {
    test(`${language} keyboard dialog lifecycle at ${width}px`, async ({
      page,
      playerPage,
    }) => {
      await page.setViewportSize({ width, height: 844 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(language === 'es' ? '/' : '/en')
      const tutorial = page.locator('#watch-tutorial')
      await tutorial.focus()
      await tutorial.press('Enter')
      await checkDialog(page, page.getByRole('dialog'))
      await page.keyboard.press('Escape')
      await expect(tutorial).toBeFocused()
      await tutorial.press('Space')
      const tutorialClose = page.getByRole('dialog').locator('#close-modal')
      await tutorialClose.focus()
      await tutorialClose.press('Enter')
      await expect(tutorial).toBeFocused()
      await page.locator('#name').fill(`Focus ${language} ${width}`)
      await page.locator('form button[type=submit]').click()
      await expect(page.locator('#open-share-modal')).toBeVisible()
      const share = page.locator('#open-share-modal')
      await share.focus()
      await share.press('Space')
      await checkDialog(page, page.getByRole('dialog'))
      await page.keyboard.press('Escape')
      await expect(share).toBeFocused()
      await share.press('Enter')
      await page
        .getByRole('dialog')
        .locator('#close-modal')
        .focus()
      await page.keyboard.press('Enter')
      await expect(share).toBeFocused()

      const en = language === 'en'
      for (const name of ['Ana', 'Bruno']) {
        await page
          .getByRole('textbox', {
            name: en ? 'Name *' : 'Nombre *',
            exact: true,
          })
          .fill(name)
        await page
          .getByRole('button', {
            name: en ? 'Add player' : 'Agregar persona',
            exact: true,
          })
          .click()
      }
      await page
        .getByRole('combobox', {
          name: en ? 'Host' : 'Dirige el juego',
          exact: true,
        })
        .selectOption({ label: 'Ana' })
      await page
        .getByRole('button', {
          name: en ? 'Start game' : 'Empezar partida',
          exact: true,
        })
        .click()
      await expect(page.getByTestId('player-row')).toHaveCount(2)
      const lobbyUrl = page.url()
      await page
        .getByTestId('player-row')
        .filter({ hasText: 'Ana' })
        .getByRole('button', { name: en ? 'Play' : 'Jugar', exact: true })
        .click()
      await expect(page.getByTestId('bingo-card')).toHaveCount(2)
      for (const id of [
        'configure-empty-cells',
        'celebrations',
        'sounds',
        'reboot-game',
      ]) {
        const trigger = page.locator(`#${id}:visible`)
        await trigger.focus()
        await trigger.press('Enter')
        await checkDialog(page, page.getByRole('dialog'))
        await page.keyboard.press('Escape')
        await expect(page.getByRole('dialog')).toHaveCount(0)
        await expect(trigger).toBeFocused()
        await trigger.press('Space')
        const close = page.getByRole('dialog').locator('#close-modal')
        await close.focus()
        await close.press('Enter')
        await expect(trigger).toBeFocused()
      }
      // A remote restart removes both the player's dialog and its trigger.
      await playerPage.setViewportSize({ width, height: 844 })
      await playerPage.goto(lobbyUrl)
      await playerPage
        .getByTestId('player-row')
        .filter({ hasText: 'Bruno' })
        .getByRole('button', { name: en ? 'Play' : 'Jugar', exact: true })
        .click()
      await expect(playerPage.getByTestId('bingo-card')).toHaveCount(2)
      const playerTrigger = playerPage.locator('#configure-empty-cells:visible')
      await playerTrigger.focus()
      await playerTrigger.press('Enter')
      await checkDialog(playerPage, playerPage.getByRole('dialog'))
      await page.locator('#reboot-game:visible').press('Enter')
      await page
        .getByRole('dialog')
        .locator('#confirm')
        .focus()
      await page.keyboard.press('Enter')
      await expect(
        page.getByRole('heading', {
          name: en ? 'Set up room' : 'Preparar sala',
          exact: true,
        }),
      ).toBeVisible()
      await expect(page.getByRole('dialog')).toHaveCount(0)
      await expect(page.locator('#__next')).not.toHaveAttribute(
        'aria-hidden',
        'true',
      )
      await page.keyboard.press('Tab')
      await expect(page.locator(':focus')).not.toHaveJSProperty(
        'tagName',
        'BODY',
      )
      await expect(playerPage.getByTestId('bingo-card')).toHaveCount(0)
      await expect(playerPage.getByRole('dialog')).toHaveCount(0)
      await expect(playerTrigger).toHaveCount(0)
      await expect(playerPage.locator('#__next')).not.toHaveAttribute(
        'aria-hidden',
        'true',
      )
      await playerPage.keyboard.press('Tab')
      await expect(playerPage.locator(':focus')).not.toHaveJSProperty(
        'tagName',
        'BODY',
      )
    })
  }
}
