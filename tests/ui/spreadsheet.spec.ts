import { stat } from 'node:fs/promises'
import { Page } from '@playwright/test'
import { test, expect } from './fixtures'

const roomName = 'Sala de exportación'
const names = { host: 'Ana anfitriona', player: 'Bruno jugador' }

async function createReadyRoom(page: Page) {
  await page.goto('/')
  await page
    .getByRole('textbox', { name: 'Nombre *', exact: true })
    .fill(roomName)
  await page.getByRole('button', { name: 'Listo', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Preparar sala' }),
  ).toBeVisible()

  for (const name of Object.values(names)) {
    await page
      .getByRole('textbox', { name: 'Nombre *', exact: true })
      .fill(name)
    await page.getByRole('button', { name: 'Agregar persona' }).click()
  }

  await page
    .getByRole('combobox', { name: 'adminId', exact: true })
    .selectOption({ label: names.host })
  await page.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Información de la sala' }),
  ).toBeVisible()
  await expect(page.getByTestId('player-row')).toHaveCount(2)
}

test('room export recovers from a failed load and downloads once', async ({
  page,
}) => {
  await createReadyRoom(page)
  await expect(page.getByRole('heading', { name: 'Exportar' })).toHaveCount(0)

  let observeChunk!: (url: string) => void
  const chunkRequest = new Promise<string>(resolve => {
    observeChunk = resolve
  })
  let releaseChunk!: () => void
  const heldChunk = new Promise<void>(resolve => {
    releaseChunk = resolve
  })
  let failNextScript = true

  await page.route('**/_next/static/chunks/**', async route => {
    if (failNextScript && route.request().resourceType() === 'script') {
      failNextScript = false
      observeChunk(route.request().url())
      await heldChunk
      await route.abort('failed')
      return
    }

    await route.continue()
  })

  const roomTitle = page.getByRole('button', {
    name: 'Información de la sala',
  })
  for (let interaction = 0; interaction < 7; interaction += 1) {
    await roomTitle.click()
  }

  await expect(page.getByRole('heading', { name: 'Exportar' })).toBeVisible()
  const loadingButton = page.getByRole('button', {
    name: 'Preparando exportación...',
  })
  await expect(loadingButton).toBeDisabled({ timeout: 2000 })
  expect(await chunkRequest).toContain('/_next/static/chunks/')

  releaseChunk()
  await expect(
    page.getByText('No pudimos preparar la exportación.'),
  ).toBeVisible()
  await expect(page.getByTestId('player-row')).toHaveCount(2)

  await page.unroute('**/_next/static/chunks/**')
  await page.getByRole('button', { name: 'Reintentar exportación' }).click()

  const downloadButton = page.getByRole('button', {
    name: `${roomName}.xls`,
  })
  await expect(downloadButton).toBeEnabled()

  const downloads: string[] = []
  page.on('download', download => downloads.push(download.suggestedFilename()))
  const downloadPromise = page.waitForEvent('download')
  await downloadButton.dblclick()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toBe(`${roomName}.xlsx`)
  const downloadPath = await download.path()
  expect(downloadPath).not.toBeNull()
  expect((await stat(downloadPath!)).size).toBeGreaterThan(0)
  expect(downloads).toEqual([`${roomName}.xlsx`])
  await expect(page.getByTestId('player-row')).toHaveCount(2)
})
