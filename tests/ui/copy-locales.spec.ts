import { test, expect } from './fixtures'

const copy = {
  es: {
    language: 'Idioma',
    roomName: 'Nombre de la sala *',
    create: 'Crear sala',
    setup: 'Preparar sala',
    playerName: 'Nombre *',
    add: 'Agregar persona',
    host: 'Dirige el juego',
    protect: 'Proteger a quien dirige con el código',
    start: 'Empezar partida',
    lobby: 'Información de la sala',
    play: 'Jugar',
    restart: 'Reiniciar partida',
    consequence: 'Se borrarán los números que salieron',
    close: 'Cerrar',
    share: 'Compartir link',
  },
  en: {
    language: 'Language',
    roomName: 'Room name *',
    create: 'Create room',
    setup: 'Set up room',
    playerName: 'Name *',
    add: 'Add player',
    host: 'Host',
    protect: 'Protect host access with the room code',
    start: 'Start game',
    lobby: 'Room information',
    play: 'Play',
    restart: 'Restart game',
    consequence: 'This clears the called numbers',
    close: 'Close',
    share: 'Share link',
  },
}

for (const language of ['es', 'en'] as const) {
  for (const width of [390, 1280]) {
    test(`${language} room actions and dialogs remain usable at ${width}px`, async ({
      page,
    }, testInfo) => {
      const text = copy[language]
      await page.setViewportSize({ width, height: 844 })
      await page.goto(language === 'es' ? '/' : '/en')
      await expect(
        page.getByRole('combobox', { name: text.language, exact: true }),
      ).toHaveValue(language)
      await expect(
        page.getByRole('link', { name: 'Google Meet' }),
      ).toHaveAttribute('href', 'https://meet.google.com/')

      const capture = async (name: string) => {
        await expect
          .poll(() =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= window.innerWidth,
            ),
          )
          .toBe(true)
        await testInfo.attach(`${language}-${width}-${name}`, {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        })
      }

      await capture('home')
      await page
        .getByRole('textbox', { name: text.roomName, exact: true })
        .fill(`Copy review ${language} ${width}`)
      await page.getByRole('button', { name: text.create, exact: true }).click()
      await expect(
        page.getByRole('heading', { name: text.setup }),
      ).toBeVisible()
      for (const name of ['Ana', 'Bruno']) {
        await page
          .getByRole('textbox', { name: text.playerName, exact: true })
          .fill(name)
        await page.getByRole('button', { name: text.add, exact: true }).click()
      }
      await page
        .getByRole('combobox', { name: text.host, exact: true })
        .selectOption({ label: 'Ana' })
      await page.locator('#room-title').click({ clickCount: 7 })
      await expect(
        page.getByRole('checkbox', { name: text.protect, exact: true }),
      ).toBeVisible()
      await capture('setup')
      await page.getByRole('button', { name: text.start, exact: true }).click()
      await expect(
        page.getByRole('heading', { name: text.lobby }),
      ).toBeVisible()
      await capture('lobby')

      await page.getByRole('button', { name: text.share, exact: true }).click()
      await expect(page.getByRole('dialog', { name: text.share })).toBeVisible()
      await capture('share')
      await page.getByRole('button', { name: text.close, exact: true }).click()

      await page
        .getByTestId('player-row')
        .filter({ hasText: 'Ana' })
        .getByRole('button', { name: text.play, exact: true })
        .click()
      await expect(page.getByTestId('bingo-card')).toHaveCount(2)
      await capture('cards')
      await page
        .getByRole('button', { name: text.restart, exact: true })
        .click()
      const dialog = page.getByRole('dialog', {
        name: text.restart,
        exact: true,
      })
      await expect(dialog).toContainText(text.consequence)
      await capture('restart')
      await dialog
        .getByRole('button', { name: text.restart, exact: true })
        .click()
      await expect(
        page.getByRole('heading', { name: text.setup }),
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: text.start, exact: true }),
      ).toBeEnabled()
    })
  }
}
