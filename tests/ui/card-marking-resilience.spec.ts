import { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { createReadyRoom, testPlayerNames } from './room-setup'

async function openPlayerCards(page: Page, name = testPlayerNames.player) {
  const row = page.getByTestId('player-row').filter({ hasText: name })
  await row.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(page.getByTestId('bingo-card')).toHaveCount(2)
}

test('two tabs retain concurrent marks and a new game starts unmarked', async ({
  page: host,
  playerPage: firstTab,
}) => {
  await createReadyRoom(host, 'Marcas concurrentes')
  const lobbyURL = host.url()

  await firstTab.goto(lobbyURL)
  await openPlayerCards(firstTab)
  const playerURL = firstTab.url()

  const secondTab = await firstTab.context().newPage()
  await secondTab.goto(playerURL)
  await expect(secondTab.getByTestId('bingo-card')).toHaveCount(2)

  const firstCard = firstTab.getByTestId('bingo-card').first()
  const secondCard = secondTab.getByTestId('bingo-card').first()
  const firstNumber = firstCard.getByRole('button').first()
  const secondNumber = secondCard.getByRole('button').nth(1)
  const firstValue = (await firstNumber.innerText()).trim()
  const secondValue = (await secondNumber.innerText()).trim()

  await Promise.all([firstNumber.click(), secondNumber.click()])

  for (const page of [firstTab, secondTab]) {
    await expect(
      page
        .getByTestId('bingo-card')
        .first()
        .getByRole('button', {
          name: firstValue,
          exact: true,
        }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      page
        .getByTestId('bingo-card')
        .first()
        .getByRole('button', {
          name: secondValue,
          exact: true,
        }),
    ).toHaveAttribute('aria-pressed', 'true')
  }

  await Promise.all([firstTab.reload(), secondTab.reload()])

  for (const page of [firstTab, secondTab]) {
    const card = page.getByTestId('bingo-card').first()
    await expect(
      card.getByRole('button', { name: firstValue, exact: true }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      card.getByRole('button', { name: secondValue, exact: true }),
    ).toHaveAttribute('aria-pressed', 'true')
  }

  await host.goto(lobbyURL)
  await openPlayerCards(host, testPlayerNames.host)
  await host.locator('#reboot-game:visible').click()
  await host
    .getByRole('dialog')
    .getByRole('button', { name: 'Confirmar' })
    .click()
  await expect(
    host.getByRole('heading', { name: 'Preparar sala' }),
  ).toBeVisible()
  await expect(
    firstTab.getByText('La sala se está configurando. Espere...'),
  ).toBeVisible()

  await host.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(
    host.getByRole('heading', { name: 'Información de la sala' }),
  ).toBeVisible()
  await firstTab.goto(host.url())
  await openPlayerCards(firstTab)
  await expect(
    firstTab.getByTestId('bingo-card').getByRole('button', { pressed: true }),
  ).toHaveCount(0)
})
