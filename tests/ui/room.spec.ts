import { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { testPlayerNames } from './room-setup'

const names = {
  ...testPlayerNames,
  replacement: 'Carla nueva anfitriona',
}
const emptyDraw = 'No salieron números todavía.'

async function readAssignedTicketIds(page: Page, name: string) {
  const row = page.getByTestId('player-row').filter({ hasText: name })
  await expect(row).toContainText(/Cartones Nº \d+ & \d+/)
  const assigned = (await row.innerText()).match(/Cartones Nº (\d+) & (\d+)/)
  expect(assigned, 'The lobby shows two assigned cards').not.toBeNull()
  if (!assigned) throw new Error('The lobby did not show two assigned cards')

  return assigned.slice(1)
}

async function expectAssignedCards(
  page: Page,
  name: string,
  ticketIds: string[],
) {
  await expect(
    page.getByRole('heading', { name: new RegExp(`Hola ${name},`) }),
  ).toBeVisible()
  await expect(page.getByTestId('bingo-card')).toHaveCount(2)
  for (const id of ticketIds) {
    await expect(
      page.getByText(`Cartón Nº ${id}`, { exact: true }),
    ).toBeVisible()
  }
  for (const card of await page.getByTestId('bingo-card').all()) {
    await expect(card.getByRole('button')).toHaveCount(15)
  }
}

async function openCards(page: Page, name: string) {
  const row = page.getByTestId('player-row').filter({ hasText: name })
  const assigned = await readAssignedTicketIds(page, name)
  await row.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expectAssignedCards(page, name, assigned)

  return assigned
}

async function drawAndObserve(host: Page, player: Page) {
  await host.getByRole('button', { name: 'Próximo número' }).click()
  const hostNumbers = host.getByTestId('called-number')
  await expect(hostNumbers).toHaveCount(1)
  await expect(hostNumbers.first()).toHaveText(/^(?:[1-9]|[1-8][0-9]|90)$/)
  const drawn = await hostNumbers.first().innerText()
  await expect(player.getByTestId('called-number')).toHaveText([drawn])
  await expect(player.getByTestId('called-number')).toBeVisible()
}

async function navigateWithNextRouter(page: Page, url: string) {
  const pathname = new URL(url).pathname

  await page.evaluate(path => {
    const nextWindow = window as typeof window & {
      next: { router: { push: (href: string) => Promise<boolean> } }
    }

    return nextWindow.next.router.push(path)
  }, pathname)
}

async function recordPlayedSounds(page: Page) {
  await page.evaluate(() => {
    const soundWindow = window as typeof window & { playedSounds: string[] }
    soundWindow.playedSounds = []
    HTMLMediaElement.prototype.play = function() {
      soundWindow.playedSounds.push(this.src)
      Object.defineProperty(this, 'duration', { value: 10 })

      return Promise.resolve()
    }
  })
}

async function readPlayedSounds(page: Page) {
  return page.evaluate(() => {
    const soundWindow = window as typeof window & { playedSounds: string[] }

    return soundWindow.playedSounds
  })
}

test('host and player create, play, reload and restart a room', async ({
  page: host,
  playerPage: player,
}) => {
  let lobbyURL = ''
  let hostURL = ''
  let hostTicketIds: string[] = []
  let playerURL = ''
  let playerTicketIds: string[] = []
  await test.step(
    'Create and configure a room with two participants',
    async () => {
      await host.goto('/')
      await host
        .getByRole('textbox', { name: 'Nombre *', exact: true })
        .fill('Sala de regresión')
      await host.getByRole('button', { name: 'Listo', exact: true }).click()
      await expect(
        host.getByRole('heading', { name: 'Preparar sala' }),
      ).toBeVisible()
      for (const name of Object.values(testPlayerNames)) {
        await host
          .getByRole('textbox', { name: 'Nombre *', exact: true })
          .fill(name)
        await host.getByRole('button', { name: 'Agregar persona' }).click()
      }
      await host
        .getByRole('combobox', { name: 'adminId', exact: true })
        .selectOption({ label: names.host })
      await host
        .getByRole('checkbox', { name: 'Usar bolillero online' })
        .check()
      await host.getByRole('button', { name: 'Jugar', exact: true }).click()
      await expect(
        host.getByRole('heading', { name: 'Información de la sala' }),
      ).toBeVisible()
      await expect(host.getByTestId('player-row')).toHaveCount(2)
      lobbyURL = host.url()
    },
  )

  await test.step(
    'Each participant opens their assigned cards in an isolated context',
    async () => {
      await player.goto(lobbyURL)
      playerTicketIds = await openCards(player, names.player)
      playerURL = player.url()
      hostTicketIds = await openCards(host, names.host)
      hostURL = host.url()
      await expect(
        host.getByRole('button', { name: 'Próximo número' }),
      ).toBeVisible()
      await expect(
        player.getByRole('button', { name: 'Próximo número' }),
      ).toHaveCount(0)
      await expect(player.locator('#reboot-game')).toHaveCount(0)
      await expect(host.getByText(emptyDraw)).toBeVisible()
      await expect(player.getByText(emptyDraw)).toBeVisible()
    },
  )

  await test.step(
    'Browser history restores the lobby and the same assigned cards',
    async () => {
      await host.goBack()
      await expect(
        host.getByRole('heading', { name: 'Información de la sala' }),
      ).toBeVisible()
      await expect(host.getByTestId('player-row')).toHaveCount(2)

      await host.goForward()
      await expectAssignedCards(host, names.host, hostTicketIds)
      await expect(
        host.getByRole('button', { name: 'Próximo número' }),
      ).toBeVisible()
    },
  )

  await test.step('Direct entry shows the same assigned cards', async () => {
    await player.goto(playerURL)
    await expectAssignedCards(player, names.player, playerTicketIds)
    await host.goto(hostURL)
    await expectAssignedCards(host, names.host, hostTicketIds)
  })

  await test.step(
    'A host draw synchronizes without reloading the player',
    async () => {
      await drawAndObserve(host, player)
    },
  )

  await test.step(
    'A host sound synchronizes to both participants',
    async () => {
      const soundPath = '/sounds/cardi-b/coronavirus.mp3'
      await recordPlayedSounds(host)
      await recordPlayedSounds(player)
      await host.locator('#sounds:visible').click()
      await host
        .getByRole('dialog', { name: 'Sonidos' })
        .getByRole('button', {
          name: 'Reproducir Cardi B - Coronavirus',
          exact: true,
        })
        .click()
      await expect
        .poll(() => readPlayedSounds(host))
        .toContainEqual(expect.stringContaining(soundPath))
      await expect
        .poll(() => readPlayedSounds(player))
        .toContainEqual(expect.stringContaining(soundPath))
      await host
        .getByRole('dialog', { name: 'Sonidos' })
        .locator('#close-modal')
        .click()
    },
  )

  await test.step(
    'A host celebration option synchronizes to both participants',
    async () => {
      await host.locator('#celebrations:visible').click()
      const dialog = host.getByRole('dialog', { name: 'Festejos' })
      await dialog
        .getByRole('button', { name: 'Activar confetti', exact: true })
        .click()
      await expect(host.locator('.confetti-base')).toHaveCount(20)
      await expect(player.locator('.confetti-base')).toHaveCount(20)
      await dialog
        .getByRole('button', { name: 'Desactivar confetti', exact: true })
        .click()
      await expect(host.locator('.confetti-base')).toHaveCount(0)
      await expect(player.locator('.confetti-base')).toHaveCount(0)
      await dialog.locator('#close-modal').click()
    },
  )

  await test.step(
    'An actual card number and both cards survive reload',
    async () => {
      const cards = player.getByTestId('bingo-card')
      const cardText = await cards.allTextContents()
      const number = cards
        .first()
        .getByRole('button')
        .first()
      const value = (await number.innerText()).trim()
      await number.click()
      await expect(number).toHaveAttribute('aria-pressed', 'true')
      await player.reload()
      await expect(cards).toHaveText(cardText)
      await expect(
        cards.first().getByRole('button', { name: value, exact: true }),
      ).toHaveAttribute('aria-pressed', 'true')
      await host.reload()
      await expectAssignedCards(host, names.host, hostTicketIds)
    },
  )

  await test.step(
    'Restart returns the host to setup and the player to waiting',
    async () => {
      await host.locator('#reboot-game:visible').click()
      await host
        .getByRole('dialog')
        .getByRole('button', { name: 'Confirmar' })
        .click()
      await expect(
        host.getByRole('heading', { name: 'Preparar sala' }),
      ).toBeVisible()
      await expect(
        player.getByText('La sala se está configurando. Espere...'),
      ).toBeVisible()
      await expect(player.getByTestId('bingo-card')).toHaveCount(0)
    },
  )

  await test.step(
    'Room setup replaces a player and changes the host before the next game',
    async () => {
      const removedPlayer = host
        .locator('#players-list > div')
        .filter({ hasText: names.player })
      await removedPlayer
        .getByRole('button', { name: 'Eliminar persona' })
        .click()
      await expect(
        host.locator('#players-list').getByText(names.player, { exact: true }),
      ).toHaveCount(0)
      await host
        .getByRole('textbox', { name: 'Nombre *', exact: true })
        .fill(names.replacement)
      await host.getByRole('button', { name: 'Agregar persona' }).click()
      await host
        .getByRole('combobox', { name: 'adminId', exact: true })
        .selectOption({ label: names.replacement })
      await host.getByRole('button', { name: 'Jugar', exact: true }).click()
      await expect(
        host.getByRole('heading', { name: 'Información de la sala' }),
      ).toBeVisible()
      await expect(
        host.getByTestId('player-row').filter({ hasText: names.player }),
      ).toHaveCount(0)
      const reconfiguredLobbyURL = host.url()
      const formerHostTicketIds = await openCards(host, names.host)
      await player.goto(reconfiguredLobbyURL)
      const newHostTicketIds = await openCards(player, names.replacement)
      await expectAssignedCards(host, names.host, formerHostTicketIds)
      await expectAssignedCards(player, names.replacement, newHostTicketIds)
      await expect(
        host.getByRole('button', { name: 'Próximo número' }),
      ).toHaveCount(0)
      await expect(host.locator('#reboot-game')).toHaveCount(0)
      await expect(
        player.getByRole('button', { name: 'Próximo número' }),
      ).toBeVisible()
      await expect(player.locator('#reboot-game:visible')).toBeVisible()
      await expect(host.getByText(emptyDraw)).toBeVisible()
      await expect(player.getByText(emptyDraw)).toBeVisible()
      await expect(host.getByTestId('called-number')).toHaveCount(0)
      await expect(player.getByTestId('called-number')).toHaveCount(0)
      await drawAndObserve(player, host)
    },
  )

  await test.step(
    'Changing rooms never exposes the previous room player list',
    async () => {
      const otherRoom = await host.context().newPage()
      await otherRoom.goto('/')
      await otherRoom
        .getByRole('textbox', { name: 'Nombre *', exact: true })
        .fill('Segunda sala')
      await otherRoom
        .getByRole('button', { name: 'Listo', exact: true })
        .click()
      await expect(
        otherRoom.getByRole('heading', { name: 'Preparar sala' }),
      ).toBeVisible()
      const otherRoomURL = otherRoom.url()
      await otherRoom.close()

      await navigateWithNextRouter(host, otherRoomURL)
      await expect(
        host.getByRole('heading', { name: 'Preparar sala' }),
      ).toBeVisible()
      await expect(host.getByText(names.host, { exact: true })).toHaveCount(0)
      await expect(host.getByText(names.player, { exact: true })).toHaveCount(0)

      await navigateWithNextRouter(host, lobbyURL)
      await expect(
        host.getByRole('heading', { name: 'Información de la sala' }),
      ).toBeVisible()
      await expect(host.getByTestId('player-row')).toHaveCount(2)

      await host.goBack()
      await expect(
        host.getByRole('heading', { name: 'Preparar sala' }),
      ).toBeVisible()
      await expect(host.getByText(names.host, { exact: true })).toHaveCount(0)
      await expect(host.getByText(names.player, { exact: true })).toHaveCount(0)
    },
  )

  await test.step(
    'Deleting a persisted player updates their open card view',
    async () => {
      await navigateWithNextRouter(host, `${lobbyURL}/admin`)
      await expect(
        host.getByRole('heading', { name: 'Preparar sala' }),
      ).toBeVisible()
      const playerRow = host
        .locator('#players-list > div')
        .filter({ hasText: names.replacement })
      await expect(playerRow).toHaveCount(1)
      await playerRow.getByRole('button', { name: 'Eliminar persona' }).click()
      await expect(player.getByText('Ocurrió un error.')).toBeVisible()
      await expect(player.getByTestId('bingo-card')).toHaveCount(0)
      await expect(
        host
          .locator('#players-list')
          .getByText(names.replacement, { exact: true }),
      ).toHaveCount(0)
    },
  )
})
