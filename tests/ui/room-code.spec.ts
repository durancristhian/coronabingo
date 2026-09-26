import { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { testPlayerNames } from './room-setup'

async function openPlayerLink(page: Page, name: string) {
  const row = page.getByTestId('player-row').filter({ hasText: name })

  await row.getByRole('button', { name: 'Jugar', exact: true }).click()
}

async function openCards(page: Page, name: string) {
  await openPlayerLink(page, name)

  await expect(
    page.getByRole('heading', { name: new RegExp(`Hola ${name},`) }),
  ).toBeVisible()
}

function codeChoices(page: Page) {
  return page
    .getByText('Ingrese el código de acceso a la sala')
    .locator('xpath=following-sibling::div[1]')
}

async function selectCode(page: Page, code: string[]) {
  for (const emojiClass of code) {
    await codeChoices(page)
      .locator(`label:has(i.${emojiClass})`)
      .click()
  }
}

test('the host room code protects each game while players enter normally', async ({
  page: host,
  playerPage: player,
}) => {
  await test.step(
    'Create a room and enable the host code from setup',
    async () => {
      await host.goto('/')
      await host
        .getByRole('textbox', { name: 'Nombre *', exact: true })
        .fill('Sala con código')
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
        .selectOption({ label: testPlayerNames.host })

      await host.locator('#room-title').click({ clickCount: 7 })
      await host
        .getByRole('checkbox', { name: 'Activar código para el admin' })
        .check()
    },
  )

  const roomCode = await test.step(
    'Read the generated code from the setup UI',
    async () => {
      const code = await host
        .getByText('Código de acceso a la sala')
        .locator('xpath=following-sibling::div[1]//i')
        .evaluateAll(emojis =>
          emojis.map(emoji =>
            Array.from(emoji.classList).find(className =>
              className.startsWith('em-'),
            ),
          ),
        )

      expect(code, 'The setup UI shows a three-emoji room code').toHaveLength(3)
      expect(code.every((emoji): emoji is string => Boolean(emoji))).toBe(true)

      return code.filter((emoji): emoji is string => Boolean(emoji))
    },
  )

  await host.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(
    host.getByRole('heading', { name: 'Información de la sala' }),
  ).toBeVisible()
  const lobbyURL = host.url()

  await test.step('A player enters their cards without a code', async () => {
    await player.goto(lobbyURL)
    await openCards(player, testPlayerNames.player)
    await expect(
      player.getByText('Ingrese el código de acceso a la sala'),
    ).toHaveCount(0)
  })

  await test.step(
    'The host can retry after a rejected code and enter with the displayed one',
    async () => {
      await openPlayerLink(host, testPlayerNames.host)
      await expect(
        host.getByText('Ingrese el código de acceso a la sala'),
      ).toBeVisible()

      const wrongCode = (
        await codeChoices(host)
          .locator('input')
          .evaluateAll(inputs =>
            inputs
              .map(input =>
                Array.from(
                  input.parentElement?.querySelector('i')?.classList || [],
                ).find(className => className.startsWith('em-')),
              )
              .filter((emoji): emoji is string => Boolean(emoji)),
          )
      )
        .filter(emoji => !roomCode.includes(emoji))
        .slice(0, 3)
      expect(
        wrongCode,
        'The code selector offers a different sequence',
      ).toHaveLength(3)

      await selectCode(host, wrongCode)
      await host.getByRole('button', { name: 'Ingresar', exact: true }).click()
      await expect(
        host.getByText('Código incorrecto. Intenta nuevamente...'),
      ).toBeVisible()
      await expect(
        host.getByText('Ingrese el código de acceso a la sala'),
      ).toBeVisible()

      await selectCode(host, wrongCode)
      await selectCode(host, roomCode)
      await host.getByRole('button', { name: 'Ingresar', exact: true }).click()
      await expect(
        host.getByRole('button', { name: 'Próximo número' }),
      ).toBeVisible()
      await expect(host.getByTestId('bingo-card')).toHaveCount(2)
    },
  )

  await test.step(
    'Restarting and starting again requires the host code again',
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

      await host.getByRole('button', { name: 'Jugar', exact: true }).click()
      await expect(
        host.getByRole('heading', { name: 'Información de la sala' }),
      ).toBeVisible()
      await openPlayerLink(host, testPlayerNames.host)
      await expect(
        host.getByText('Ingrese el código de acceso a la sala'),
      ).toBeVisible()
      await expect(host.getByTestId('bingo-card')).toHaveCount(0)
    },
  )
})
