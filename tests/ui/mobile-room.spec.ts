import { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { configureRoom, startReadyRoom, testPlayerNames } from './room-setup'

const mobileViewport = { width: 390, height: 844 }

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true)
}

async function openCards(page: Page, name: string) {
  const row = page.getByTestId('player-row').filter({ hasText: name })

  await row.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: new RegExp(`Hola ${name},`) }),
  ).toBeVisible()
  const cards = page.getByTestId('bingo-card')
  await expect(cards).toHaveCount(2)
  for (const card of await cards.all()) {
    await expect(card).toBeVisible()
    await expect(card.getByRole('button').first()).toBeEnabled()
  }
}

test('mobile host and player create a room and synchronize their first draw', async ({
  page: host,
  playerPage: player,
}) => {
  await host.setViewportSize(mobileViewport)
  await player.setViewportSize(mobileViewport)
  expect(host.viewportSize()).toEqual(mobileViewport)
  expect(player.viewportSize()).toEqual(mobileViewport)

  await test.step(
    'Create the room and prepare it without horizontal overflow',
    async () => {
      await host.goto('/')
      await expect(
        host.getByRole('textbox', { name: 'Nombre *', exact: true }),
      ).toBeVisible()
      await host
        .getByRole('textbox', { name: 'Nombre *', exact: true })
        .fill('Sala móvil')
      await expect(
        host.getByRole('button', { name: 'Listo', exact: true }),
      ).toBeEnabled()
      await expectNoHorizontalOverflow(host)

      await host.getByRole('button', { name: 'Listo', exact: true }).click()
      await expect(
        host.getByRole('heading', { name: 'Preparar sala' }),
      ).toBeVisible()
      await expect(
        host.getByRole('button', { name: 'Agregar persona', exact: true }),
      ).toBeVisible()
      await expect(
        host.getByRole('combobox', { name: 'adminId', exact: true }),
      ).toBeVisible()
      await expectNoHorizontalOverflow(host)

      await configureRoom(host, { useOnlineCaller: true })
      await expect(
        host.getByRole('button', { name: 'Jugar', exact: true }),
      ).toBeEnabled()
      await expectNoHorizontalOverflow(host)

      await startReadyRoom(host)
      await expect(
        host.getByRole('heading', { name: 'Información de la sala' }),
      ).toBeVisible()
      await expectNoHorizontalOverflow(host)
    },
  )

  await test.step(
    'Open both assigned card views at the same mobile viewport',
    async () => {
      const lobbyURL = host.url()
      await player.goto(lobbyURL)
      await expectNoHorizontalOverflow(player)

      await openCards(player, testPlayerNames.player)
      await openCards(host, testPlayerNames.host)

      await expect(
        host.getByRole('button', { name: 'Próximo número', exact: true }),
      ).toBeVisible()
      await expect(
        host.getByRole('button', { name: 'Próximo número', exact: true }),
      ).toBeEnabled()
      await expect(
        player.getByRole('button', { name: 'Próximo número', exact: true }),
      ).toHaveCount(0)
      await expectNoHorizontalOverflow(host)
      await expectNoHorizontalOverflow(player)
    },
  )

  await test.step(
    'The host draw remains actionable and synchronizes to the player',
    async () => {
      await host
        .getByRole('button', { name: 'Próximo número', exact: true })
        .click()
      const hostDraw = host.getByTestId('called-number')
      await expect(hostDraw).toHaveCount(1)
      const drawnNumber = await hostDraw.innerText()
      await expect(player.getByTestId('called-number')).toHaveText([
        drawnNumber,
      ])
      await expectNoHorizontalOverflow(host)
      await expectNoHorizontalOverflow(player)
    },
  )
})
