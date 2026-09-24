import { Page } from '@playwright/test'
import { test, expect } from './fixtures'

const names = { host: 'Ana anfitriona', player: 'Bruno jugador' }
const emptyDraw = 'No salieron números todavía.'

async function openCards(page: Page, name: string) {
  const row = page.getByTestId('player-row').filter({ hasText: name })
  await expect(row).toContainText(/Cartones Nº \d+ & \d+/)
  const assigned = (await row.innerText()).match(/Cartones Nº (\d+) & (\d+)/)
  expect(assigned, 'The lobby shows two assigned cards').not.toBeNull()
  await row.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: new RegExp(`Hola ${name},`) }),
  ).toBeVisible()
  await expect(page.getByTestId('bingo-card')).toHaveCount(2)
  for (const id of assigned!.slice(1)) {
    await expect(
      page.getByText(`Cartón Nº ${id}`, { exact: true }),
    ).toBeVisible()
  }
  for (const card of await page.getByTestId('bingo-card').all()) {
    await expect(card.getByRole('button')).toHaveCount(15)
  }
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

test('host and player create, play, reload and restart a room', async ({
  page: host,
  playerPage: player,
}) => {
  let lobbyURL = ''
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
      for (const name of Object.values(names)) {
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
      await openCards(player, names.player)
      await openCards(host, names.host)
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
    'A host draw synchronizes without reloading the player',
    async () => {
      await drawAndObserve(host, player)
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
    'A new game clears the draw and synchronizes again',
    async () => {
      await host.getByRole('button', { name: 'Jugar', exact: true }).click()
      await expect(
        host.getByRole('heading', { name: 'Información de la sala' }),
      ).toBeVisible()
      await openCards(host, names.host)
      await expect(player.getByTestId('bingo-card')).toHaveCount(2)
      await expect(
        player.getByRole('heading', {
          name: new RegExp(`Hola ${names.player},`),
        }),
      ).toBeVisible()
      await expect(host.getByText(emptyDraw)).toBeVisible()
      await expect(player.getByText(emptyDraw)).toBeVisible()
      await expect(host.getByTestId('called-number')).toHaveCount(0)
      await expect(player.getByTestId('called-number')).toHaveCount(0)
      await drawAndObserve(host, player)
    },
  )
})
