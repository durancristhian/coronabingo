import { readFileSync } from 'node:fs'
import { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { createReadyRoom, testPlayerNames } from './room-setup'

async function openPlayerCards(
  page: Page,
  name = testPlayerNames.player,
  playButton = 'Jugar',
) {
  const row = page.getByTestId('player-row').filter({ hasText: name })
  await row.getByRole('button', { name: playButton, exact: true }).click()
  await expect(page.getByTestId('bingo-card')).toHaveCount(2)
}

async function expectMarks(page: Page, values: string[]) {
  const card = page.getByTestId('bingo-card').first()
  for (const value of values) {
    await expect(
      card.getByRole('button', { name: value, exact: true }),
    ).toHaveAttribute('aria-pressed', 'true')
  }
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
    await expectMarks(page, [firstValue, secondValue])
  }

  await Promise.all([firstTab.reload(), secondTab.reload()])

  for (const page of [firstTab, secondTab]) {
    await expectMarks(page, [firstValue, secondValue])
  }

  await host.goto(lobbyURL)
  await openPlayerCards(host, testPlayerNames.host)
  await host.locator('#reboot-game:visible').click()
  await host
    .getByRole('dialog')
    .getByRole('button', { name: 'Reiniciar partida' })
    .click()
  await expect(
    host.getByRole('heading', { name: 'Preparar sala' }),
  ).toBeVisible()
  await expect(
    firstTab.getByText('Están preparando la sala. Espera un momento...'),
  ).toBeVisible()

  await host
    .getByRole('button', { name: 'Empezar partida', exact: true })
    .click()
  await expect(
    host.getByRole('heading', { name: 'Información de la sala' }),
  ).toBeVisible()
  await firstTab.goto(host.url())
  await openPlayerCards(firstTab)
  await expect(
    firstTab.getByTestId('bingo-card').getByRole('button', { pressed: true }),
  ).toHaveCount(0)
})

test('English cards retain concurrent marks after reload', async ({
  page: host,
  playerPage: firstTab,
}) => {
  await createReadyRoom(host, 'English concurrent marks')
  const lobbyPath = new URL(host.url()).pathname
  const englishLobbyURL = `/en${lobbyPath}`

  await firstTab.goto(englishLobbyURL)
  await openPlayerCards(firstTab, testPlayerNames.player, 'Play')
  const playerURL = firstTab.url()

  const secondTab = await firstTab.context().newPage()
  await secondTab.goto(playerURL)
  await expect(secondTab.getByTestId('bingo-card')).toHaveCount(2)

  const firstNumber = firstTab
    .getByTestId('bingo-card')
    .first()
    .getByRole('button')
    .first()
  const secondNumber = secondTab
    .getByTestId('bingo-card')
    .first()
    .getByRole('button')
    .nth(1)
  const firstValue = (await firstNumber.innerText()).trim()
  const secondValue = (await secondNumber.innerText()).trim()

  await Promise.all([firstNumber.click(), secondNumber.click()])
  for (const page of [firstTab, secondTab]) {
    await expectMarks(page, [firstValue, secondValue])
  }

  await Promise.all([firstTab.reload(), secondTab.reload()])
  for (const page of [firstTab, secondTab]) {
    await expectMarks(page, [firstValue, secondValue])
  }
})

for (const locale of ['es', 'en']) {
  test(`${locale}: a queued mark cannot revive a removed player`, async ({
    page: host,
    playerPage: player,
  }) => {
    const errors: string[] = []
    player.on('pageerror', error => errors.push(error.message))
    await createReadyRoom(host, `Removed player ${locale}`)
    const lobbyPath = new URL(host.url()).pathname
    await player.goto(`${locale === 'en' ? '/en' : ''}${lobbyPath}`)
    await openPlayerCards(
      player,
      testPlayerNames.player,
      locale === 'en' ? 'Play' : 'Jugar',
    )
    await player.context().setOffline(true)
    const mark = player
      .getByTestId('bingo-card')
      .first()
      .getByRole('button')
      .first()
    await mark.click()
    await expect(mark).toHaveAttribute('aria-pressed', 'false')

    await openPlayerCards(host, testPlayerNames.host)
    await host.locator('#reboot-game:visible').click()
    await host
      .getByRole('dialog')
      .getByRole('button', { name: 'Reiniciar partida' })
      .click()
    await expect(
      host.getByRole('heading', { name: 'Preparar sala' }),
    ).toBeVisible()
    await host
      .locator('#players-list > div')
      .filter({ hasText: testPlayerNames.player })
      .getByRole('button', { name: 'Eliminar persona' })
      .click()
    await expect(
      host
        .locator('#players-list')
        .getByText(testPlayerNames.player, { exact: true }),
    ).toHaveCount(0)
    await host
      .getByRole('textbox', { name: 'Nombre *', exact: true })
      .fill('Carla reemplazo')
    await host.getByRole('button', { name: 'Agregar persona' }).click()
    await host
      .getByRole('button', { name: 'Empezar partida', exact: true })
      .click()
    await expect(
      host.getByRole('heading', { name: 'Información de la sala' }),
    ).toBeVisible()

    await player.context().setOffline(false)
    const recovery = player.getByRole('link', {
      name: locale === 'en' ? 'Back to room' : 'Volver a la sala',
      exact: true,
    })
    await expect(recovery).toBeVisible()
    await expect(player.getByTestId('bingo-card')).toHaveCount(0)
    await player.reload()
    await expect(recovery).toBeVisible()
    await recovery.click()
    await expect(player.getByTestId('player-row')).toHaveCount(2)
    await expect(
      player
        .getByTestId('player-row')
        .filter({ hasText: testPlayerNames.player }),
    ).toHaveCount(0)
    await openPlayerCards(
      player,
      'Carla reemplazo',
      locale === 'en' ? 'Play' : 'Jugar',
    )
    const replacementMark = player
      .getByTestId('bingo-card')
      .first()
      .getByRole('button')
      .first()
    await replacementMark.click()
    await expect(replacementMark).toHaveAttribute('aria-pressed', 'true')
    expect(errors).toEqual([])
  })
}

test('a rejected card write shows a retry message without confirming the mark', async ({
  page: host,
  playerPage: player,
  request,
}) => {
  await createReadyRoom(host, 'Rejected card write')
  await player.goto(host.url())
  await openPlayerCards(player)
  const errors: string[] = []
  player.on('pageerror', error => errors.push(error.message))
  const rulesURL =
    'http://127.0.0.1:8187/emulator/v1/projects/demo-coronabingo-ui:securityRules'
  const rules = readFileSync('tests/ui/firestore.rules', 'utf8')
  const deniedRules = rules.replace(
    'match /players/{playerId} {\n        allow read, write: if true;',
    'match /players/{playerId} {\n        allow read: if true;\n        allow write: if false;',
  )
  const setRules = async (content: string) => {
    const response = await request.put(rulesURL, {
      data: { rules: { files: [{ name: 'firestore.rules', content }] } },
    })
    expect(response.ok()).toBeTruthy()
  }
  const mark = player
    .getByTestId('bingo-card')
    .first()
    .getByRole('button')
    .first()
  try {
    await setRules(deniedRules)
    await mark.click()
    await expect(
      player
        .getByRole('alert')
        .filter({ hasText: 'No pudimos guardar esta marca.' }),
    ).toContainText('No pudimos guardar esta marca.')
    await expect(mark).toHaveAttribute('aria-pressed', 'false')
    expect(errors).toEqual([])
  } finally {
    await setRules(rules)
  }
  await mark.click()
  await expect(mark).toHaveAttribute('aria-pressed', 'true')
  await expect(
    player
      .getByRole('alert')
      .filter({ hasText: 'No pudimos guardar esta marca.' }),
  ).toHaveCount(0)
})
