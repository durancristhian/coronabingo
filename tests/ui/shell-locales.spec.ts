import { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { createReadyRoom, testPlayerNames } from './room-setup'

async function readAssignedTicketIds(page: Page, name: string) {
  const row = page.getByTestId('player-row').filter({ hasText: name })
  await expect(row).toContainText(/Cartones Nº \d+ & \d+/)
  const assigned = (await row.innerText()).match(/Cartones Nº (\d+) & (\d+)/)
  expect(assigned, 'The lobby shows two assigned cards').not.toBeNull()
  if (!assigned) throw new Error('The lobby did not show two assigned cards')

  return assigned.slice(1)
}

async function openPlayerCards(page: Page, name: string) {
  const assigned = await readAssignedTicketIds(page, name)
  const row = page.getByTestId('player-row').filter({ hasText: name })
  await row.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: `Hola ${name},` }),
  ).toBeVisible()
  await expect(page.getByTestId('bingo-card')).toHaveCount(2)

  return assigned
}

test('a player changes the language without leaving the room or cards', async ({
  page: host,
  playerPage: player,
}) => {
  await createReadyRoom(host, 'Idioma en partida', { useOnlineCaller: true })
  const lobbyURL = host.url()

  await player.goto(lobbyURL)
  const ticketIds = await openPlayerCards(player, testPlayerNames.player)
  const spanishURL = new URL(player.url())

  await player
    .getByRole('combobox', { name: 'language', exact: true })
    .selectOption('en')

  const englishURL = new URL(player.url())
  expect(
    englishURL.pathname
      .split('/')
      .filter(Boolean)
      .slice(-2),
  ).toEqual(
    spanishURL.pathname
      .split('/')
      .filter(Boolean)
      .slice(-2),
  )
  await expect(
    player.getByRole('heading', {
      name: `Hi ${testPlayerNames.player}, you are in the room Idioma en partida`,
    }),
  ).toBeVisible()
  await expect(
    player.getByRole('heading', { name: 'Last numbers' }),
  ).toBeVisible()
  await expect(player.getByTestId('bingo-card')).toHaveCount(2)
  for (const ticketId of ticketIds) {
    await expect(
      player.getByText(`Ticket Nº ${ticketId}`, { exact: true }),
    ).toBeVisible()
  }

  await host.goto(lobbyURL)
  await openPlayerCards(host, testPlayerNames.host)
  await host.getByRole('button', { name: 'Próximo número' }).click()
  const drawn = host.getByTestId('called-number').first()
  await expect(drawn).toHaveText(/^(?:[1-9]|[1-8][0-9]|90)$/)
  await expect(player.getByTestId('called-number')).toHaveText(
    await drawn.innerText(),
  )
})
