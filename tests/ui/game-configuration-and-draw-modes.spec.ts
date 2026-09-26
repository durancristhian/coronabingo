import { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { firestorePort, projectId } from './environment'
import { createReadyRoom, testPlayerNames } from './room-setup'

const allButLastNumber = Array.from({ length: 89 }, (_, index) => index + 1)

async function openCards(page: Page, name: string) {
  const playerRow = page.getByTestId('player-row').filter({ hasText: name })
  await playerRow.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: new RegExp(`Hola ${name},`) }),
  ).toBeVisible()
  await expect(page.getByTestId('bingo-card')).toHaveCount(2)
}

async function seedSelectedNumbers(roomId: string, selectedNumbers: number[]) {
  const response = await fetch(
    `http://127.0.0.1:${firestorePort}/v1/projects/${projectId}/databases/(default)/documents/rooms/${roomId}?updateMask.fieldPaths=selectedNumbers`,
    {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        fields: {
          selectedNumbers: {
            arrayValue: {
              values: selectedNumbers.map(number => ({
                integerValue: String(number),
              })),
            },
          },
        },
      }),
    },
  )

  expect(
    response.ok,
    'The local Firestore Emulator accepts the test seed',
  ).toBe(true)
}

function roomIdFromLobby(url: string) {
  const [, , roomId] = new URL(url).pathname.split('/')
  if (!roomId) throw new Error('The room lobby URL did not include a room ID')

  return roomId
}

test('the host manually synchronizes a draw and a player cannot change it', async ({
  page: host,
  playerPage: player,
}) => {
  await createReadyRoom(host, 'Sala de bolillero manual')
  const lobbyURL = host.url()

  await player.goto(lobbyURL)
  await openCards(player, testPlayerNames.player)
  await openCards(host, testPlayerNames.host)

  const hostNumber = host.locator('#ticket-numbers').getByRole('button', {
    name: '7',
    exact: true,
  })
  const playerNumber = player.locator('#ticket-numbers').getByRole('button', {
    name: '7',
    exact: true,
  })

  await expect(
    host.getByRole('button', { name: 'Próximo número' }),
  ).toHaveCount(0)
  await expect(
    player.getByRole('button', { name: 'Próximo número' }),
  ).toHaveCount(0)

  await hostNumber.click()
  await expect(hostNumber).toHaveClass(/bg-green-400/)
  await expect(playerNumber).toHaveClass(/bg-green-400/)
  await expect(host.getByTestId('called-number')).toHaveText(['7'])
  await expect(player.getByTestId('called-number')).toHaveText(['7'])

  await playerNumber.click()
  await expect(hostNumber).toHaveClass(/bg-green-400/)
  await expect(playerNumber).toHaveClass(/bg-green-400/)

  await hostNumber.click()
  await expect(hostNumber).not.toHaveClass(/bg-green-400/)
  await expect(playerNumber).not.toHaveClass(/bg-green-400/)
  await expect(host.getByTestId('called-number')).toHaveCount(0)
  await expect(player.getByTestId('called-number')).toHaveCount(0)
})

test('the last online draw reaches 90 unique numbers and disables the control', async ({
  page: host,
}) => {
  await createReadyRoom(host, 'Sala límite de bolillero', {
    useOnlineCaller: true,
  })
  await seedSelectedNumbers(roomIdFromLobby(host.url()), allButLastNumber)
  await openCards(host, testPlayerNames.host)

  const nextNumber = host.getByRole('button', { name: 'Próximo número' })
  await expect(nextNumber).toBeEnabled()
  await expect(host.getByTestId('called-number')).toHaveCount(89)

  await nextNumber.click()
  await expect(host.getByTestId('called-number')).toHaveCount(90)
  await expect
    .poll(() => host.getByTestId('called-number').allTextContents())
    .toContain('90')
  await expect(nextNumber).toBeDisabled()

  const drawnNumbers = await host.getByTestId('called-number').allTextContents()
  expect(new Set(drawnNumbers).size).toBe(90)
})
