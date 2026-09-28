import { Page } from '@playwright/test'
import { expect } from './fixtures'

export const testPlayerNames = {
  host: 'Ana anfitriona',
  player: 'Bruno jugador',
}

export async function createRoom(page: Page, roomName: string) {
  await page.goto('/')
  await page
    .getByRole('textbox', { name: 'Nombre de la sala *', exact: true })
    .fill(roomName)
  await page.getByRole('button', { name: 'Crear sala', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Preparar sala' }),
  ).toBeVisible()
}

export async function configureRoom(
  page: Page,
  { useOnlineCaller = false } = {},
) {
  for (const name of Object.values(testPlayerNames)) {
    await page
      .getByRole('textbox', { name: 'Nombre *', exact: true })
      .fill(name)
    await page.getByRole('button', { name: 'Agregar persona' }).click()
  }

  await page
    .getByRole('combobox', { name: 'Dirige el juego', exact: true })
    .selectOption({ label: testPlayerNames.host })
  const onlineCaller = page.getByRole('checkbox', {
    name: 'Usar bolillero online',
  })
  if (useOnlineCaller) {
    await onlineCaller.check()
  } else {
    await onlineCaller.uncheck()
  }
}

export async function startReadyRoom(page: Page) {
  await page
    .getByRole('button', { name: 'Empezar partida', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Información de la sala' }),
  ).toBeVisible()
  await expect(page.getByTestId('player-row')).toHaveCount(2)
}

export async function configureReadyRoom(page: Page, options = {}) {
  await configureRoom(page, options)
  await startReadyRoom(page)
}

export async function createReadyRoom(
  page: Page,
  roomName: string,
  options = {},
) {
  await createRoom(page, roomName)
  await configureReadyRoom(page, options)
}
