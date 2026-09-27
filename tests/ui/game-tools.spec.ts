import { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { createReadyRoom, testPlayerNames } from './room-setup'

async function openPlayerCards(page: Page, name: string) {
  const playerRow = page.getByTestId('player-row').filter({ hasText: name })
  await playerRow.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(page.getByTestId('bingo-card')).toHaveCount(2)
}

async function replaceAudio(page: Page) {
  await page.evaluate(() => {
    const soundWindow = window as typeof window & { playedSounds: string[] }
    soundWindow.playedSounds = []

    class TestAudio {
      duration = 10
      volume = 1

      constructor(src: string) {
        soundWindow.playedSounds.push(src)
      }

      play() {
        return Promise.resolve()
      }

      remove() {
        return undefined
      }
    }

    Object.defineProperty(window, 'Audio', {
      configurable: true,
      value: TestAudio,
    })
  })
}

async function readPlayedSounds(page: Page) {
  return page.evaluate(() => {
    const soundWindow = window as typeof window & { playedSounds: string[] }

    return soundWindow.playedSounds
  })
}

test('a player keeps an included empty-cell background after reload', async ({
  page: host,
  playerPage: player,
}) => {
  await createReadyRoom(host, 'Fondo personal')
  await player.goto(host.url())
  await openPlayerCards(player, testPlayerNames.player)

  await player.locator('#configure-empty-cells:visible').click()
  await player
    .getByRole('dialog', { name: 'Fondo de las celdas vacías' })
    .getByRole('button', { name: 'Pikachu', exact: true })
    .click()
  await expect(
    player.getByTestId('bingo-card').locator('[style*="pokemon/025.png"]'),
  ).toHaveCount(24)

  await player.reload()
  await expect(
    player.getByTestId('bingo-card').locator('[style*="pokemon/025.png"]'),
  ).toHaveCount(24)
})

test('host celebration and sound reach another player context', async ({
  page: host,
  playerPage: player,
}) => {
  await createReadyRoom(host, 'Herramientas del host')
  const lobbyURL = host.url()

  await player.goto(lobbyURL)
  await openPlayerCards(player, testPlayerNames.player)
  await openPlayerCards(host, testPlayerNames.host)
  await replaceAudio(host)
  await replaceAudio(player)

  await host.locator('#celebrations:visible').click()
  const celebrations = host.getByRole('dialog', { name: 'Festejos' })
  await celebrations
    .getByRole('button', { name: 'Activar confetti', exact: true })
    .click()
  await expect(player.locator('.confetti-base')).toHaveCount(20)
  await celebrations.locator('#close-modal').click()

  const soundPath = '/sounds/cardi-b/coronavirus.mp3'
  await host.locator('#sounds:visible').click()
  await host
    .getByRole('dialog', { name: 'Sonidos' })
    .getByRole('button', {
      name: 'Reproducir Cardi B - Coronavirus',
      exact: true,
    })
    .click()
  await expect
    .poll(() => readPlayedSounds(player))
    .toContainEqual(expect.stringContaining(soundPath))
})
