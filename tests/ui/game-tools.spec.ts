import { Page } from '@playwright/test'
import { readAnalyticsEvents } from './analytics'
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
      duration = 0.5
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

test('a player keeps the optimized empty-cell background after reload', async ({
  page: host,
  playerPage: player,
}) => {
  await createReadyRoom(host, 'Fondo personal')
  await player.goto(host.url())
  await openPlayerCards(player, testPlayerNames.player)

  const playerId = new URL(player.url()).pathname.split('/').pop()
  expect(playerId).toBeTruthy()
  await player.evaluate(id => {
    localStorage.setItem(
      'backgroundCell',
      JSON.stringify({
        [id as string]: { type: 'img', value: 'coronavirus.gif' },
      }),
    )
  }, playerId)
  const optimizedAsset = player.waitForResponse(response =>
    response.url().endsWith('/background-cells/coronavirus.28e4692f.webp'),
  )
  await player.reload()
  const assetResponse = await optimizedAsset
  expect(assetResponse.status()).toBe(200)
  expect(assetResponse.headers()['content-type']).toBe('image/webp')
  expect((await assetResponse.body()).byteLength).toBe(1_049_854)
  await expect(
    player
      .getByTestId('bingo-card')
      .locator('[style*="coronavirus.28e4692f.webp"]'),
  ).toHaveCount(24)
  await expect
    .poll(() =>
      player.evaluate(() => {
        const saved = JSON.parse(localStorage.getItem('backgroundCell') || '{}')

        return Object.values(saved)[0]
      }),
    )
    .toEqual({ type: 'img', value: 'coronavirus.gif' })

  await player.locator('#configure-empty-cells:visible').click()
  const coronavirusOption = player
    .getByRole('dialog', { name: 'Fondo de las celdas vacías' })
    .getByRole('button', { name: 'COVID-19', exact: true })
  await expect(
    coronavirusOption.locator('[style*="coronavirus.28e4692f.webp"]'),
  ).toHaveCount(1)
  await expect(coronavirusOption).toHaveClass(/bg-green-200/)

  await player.evaluate(() => localStorage.removeItem('backgroundCell'))
  await coronavirusOption.click()
  await expect
    .poll(() =>
      player.evaluate(() => {
        const saved = JSON.parse(localStorage.getItem('backgroundCell') || '{}')

        return Object.values(saved)[0]
      }),
    )
    .toEqual({ type: 'img', value: 'coronavirus.gif' })

  await player.reload()
  await expect(
    player
      .getByTestId('bingo-card')
      .locator('[style*="coronavirus.28e4692f.webp"]'),
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
    .evaluate(button => {
      const celebration = button as HTMLButtonElement
      celebration.click()
      celebration.click()
    })
  await expect(player.locator('.confetti-base')).toHaveCount(20)

  await expect
    .poll(async () => {
      const events = await readAnalyticsEvents(host)
      return events.filter(event => event.eventName === 'celebration_used')
    })
    .toEqual([
      {
        eventName: 'celebration_used',
        eventParams: {
          celebration_type: 'confetti',
          first_use_in_play: 'yes',
          play_number: 1,
          schema_version: 'v1',
          ui_language: 'es',
        },
      },
    ])

  await celebrations
    .getByRole('button', { name: 'Desactivar confetti', exact: true })
    .click()
  await expect(player.locator('.confetti-base')).toHaveCount(0)
  await celebrations
    .getByRole('button', { name: 'Mostrar globos', exact: true })
    .click()
  await expect(player.locator('.balloon')).toHaveCount(25)

  await expect
    .poll(async () => {
      const events = await readAnalyticsEvents(host)
      return events.filter(event => event.eventName === 'celebration_used')
    })
    .toEqual([
      {
        eventName: 'celebration_used',
        eventParams: {
          celebration_type: 'confetti',
          first_use_in_play: 'yes',
          play_number: 1,
          schema_version: 'v1',
          ui_language: 'es',
        },
      },
      {
        eventName: 'celebration_used',
        eventParams: {
          celebration_type: 'balloons',
          first_use_in_play: 'no',
          play_number: 1,
          schema_version: 'v1',
          ui_language: 'es',
        },
      },
    ])
  await celebrations.locator('#close-modal').click()

  const soundPath = '/sounds/cardi-b/coronavirus.mp3'
  await host.locator('#sounds:visible').click()
  const firstSound = host
    .getByRole('dialog', { name: 'Sonidos' })
    .getByRole('button', {
      name: 'Reproducir Cardi B - Coronavirus',
      exact: true,
    })
  await firstSound.evaluate(button => {
    const sound = button as HTMLButtonElement
    sound.click()
    sound.click()
  })
  await expect
    .poll(() => readPlayedSounds(player))
    .toContainEqual(expect.stringContaining(soundPath))

  await expect
    .poll(async () => {
      const events = await readAnalyticsEvents(host)
      return events.filter(event => event.eventName === 'sound_used')
    })
    .toEqual([
      {
        eventName: 'sound_used',
        eventParams: {
          first_use_in_play: 'yes',
          play_number: 1,
          schema_version: 'v1',
          sound_catalog: 'standard',
          sound_key: 'cardi_b_coronavirus',
          ui_language: 'es',
        },
      },
    ])

  await expect(firstSound).toBeEnabled()
  await host
    .getByRole('dialog', { name: 'Sonidos' })
    .getByRole('button', {
      name: 'Reproducir Chino cirujano - Pero pagaraprata',
      exact: true,
    })
    .click()

  await expect
    .poll(async () => {
      const events = await readAnalyticsEvents(host)
      return events.filter(event => event.eventName === 'sound_used')
    })
    .toEqual([
      {
        eventName: 'sound_used',
        eventParams: {
          first_use_in_play: 'yes',
          play_number: 1,
          schema_version: 'v1',
          sound_catalog: 'standard',
          sound_key: 'cardi_b_coronavirus',
          ui_language: 'es',
        },
      },
      {
        eventName: 'sound_used',
        eventParams: {
          first_use_in_play: 'no',
          play_number: 1,
          schema_version: 'v1',
          sound_catalog: 'standard',
          sound_key: 'chino_cirujano_pagaraprata',
          ui_language: 'es',
        },
      },
    ])

  const eventPayload = JSON.stringify(await readAnalyticsEvents(host))
  const roomId = new URL(lobbyURL).pathname
    .split('/')
    .filter(Boolean)
    .pop()
  expect(eventPayload).not.toContain(roomId)
  expect(eventPayload).not.toContain(soundPath)
})
