import { stat } from 'node:fs/promises'
import { test, expect } from './fixtures'
import { createReadyRoom } from './room-setup'

const roomName = 'Sala de exportación'

test('room export recovers from a failed load and downloads once', async ({
  page,
}) => {
  const initialScriptPaths = new Set<string>()
  let observeChunk!: (url: string) => void
  const chunkRequest = new Promise<string>(resolve => {
    observeChunk = resolve
  })
  let releaseChunk!: () => void
  const heldChunk = new Promise<void>(resolve => {
    releaseChunk = resolve
  })
  let failNextScript = true
  let exportActivated = false

  await page.route('**/_next/static/chunks/**', async route => {
    const request = route.request()
    if (request.resourceType() !== 'script') {
      await route.continue()
      return
    }

    const scriptPath = new URL(request.url()).pathname
    if (!exportActivated) {
      initialScriptPaths.add(scriptPath)
      await route.continue()
      return
    }

    if (failNextScript) {
      failNextScript = false
      observeChunk(scriptPath)
      await heldChunk
      await route.abort('failed')
      return
    }

    await route.continue()
  })

  await createReadyRoom(page, roomName)
  await expect(page.getByRole('heading', { name: 'Exportar' })).toHaveCount(0)
  await page.setViewportSize({ width: 390, height: 844 })

  const roomTitle = page.getByRole('button', {
    name: 'Información de la sala',
  })
  exportActivated = true
  for (let interaction = 0; interaction < 7; interaction += 1) {
    await roomTitle.click()
  }

  await expect(page.getByRole('heading', { name: 'Exportar' })).toBeVisible()
  const loadingButton = page.getByRole('button', {
    name: 'Preparando exportación...',
  })
  await expect(loadingButton).toBeDisabled({ timeout: 2000 })
  const requestedChunkPath = await chunkRequest
  expect(requestedChunkPath).toContain('/_next/static/chunks/')
  expect(initialScriptPaths).not.toContain(requestedChunkPath)
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)

  releaseChunk()
  await expect(
    page.getByText('No pudimos preparar la exportación.'),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Reintentar exportación' }),
  ).toBeVisible()
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await expect(page.getByTestId('player-row')).toHaveCount(2)

  await page.unroute('**/_next/static/chunks/**')
  await page.getByRole('button', { name: 'Reintentar exportación' }).click()

  const downloadButton = page.getByRole('button', {
    name: `${roomName}.xls`,
  })
  await expect(downloadButton).toBeEnabled()
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)

  const downloads: string[] = []
  page.on('download', download => downloads.push(download.suggestedFilename()))
  const downloadPromise = page.waitForEvent('download')
  await downloadButton.dblclick()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toBe(`${roomName}.xlsx`)
  const downloadPath = await download.path()
  expect(downloadPath).not.toBeNull()
  expect((await stat(downloadPath!)).size).toBeGreaterThan(0)
  await expect(downloadButton).toBeEnabled()
  expect(downloads).toEqual([`${roomName}.xlsx`])
  const unexpectedDownload = await page
    .waitForEvent('download', { timeout: 750 })
    .then(
      () => true,
      error => {
        if (!(error instanceof Error) || error.name !== 'TimeoutError') {
          throw error
        }
        return false
      },
    )
  expect(unexpectedDownload).toBe(false)
  expect(downloads).toEqual([`${roomName}.xlsx`])
  await expect(page.getByTestId('player-row')).toHaveCount(2)
})
