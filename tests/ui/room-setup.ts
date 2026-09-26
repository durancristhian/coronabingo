import { Page } from '@playwright/test'
import { expect } from './fixtures'

export const testPlayerNames = {
  host: 'Ana anfitriona',
  player: 'Bruno jugador',
}

export async function createReadyRoom(
  page: Page,
  roomName: string,
  { useOnlineCaller = false } = {},
) {
  await page.goto('/')
  await page
    .getByRole('textbox', { name: 'Nombre *', exact: true })
    .fill(roomName)
  await page.getByRole('button', { name: 'Listo', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Preparar sala' }),
  ).toBeVisible()

  for (const name of Object.values(testPlayerNames)) {
    await page
      .getByRole('textbox', { name: 'Nombre *', exact: true })
      .fill(name)
    await page.getByRole('button', { name: 'Agregar persona' }).click()
  }

  await page
    .getByRole('combobox', { name: 'adminId', exact: true })
    .selectOption({ label: testPlayerNames.host })
  const onlineCaller = page.getByRole('checkbox', {
    name: 'Usar bolillero online',
  })
  if (useOnlineCaller) {
    await onlineCaller.check()
  } else {
    await onlineCaller.uncheck()
  }
  await page.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Información de la sala' }),
  ).toBeVisible()
  await expect(page.getByTestId('player-row')).toHaveCount(2)
}
