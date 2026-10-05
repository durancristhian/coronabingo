import { test, expect } from './fixtures'
import { readAnalyticsEvents } from './analytics'
import { firestorePort, projectId } from './environment'

const copy = {
  es: {
    path: '/',
    name: 'Nombre de la sala *',
    submit: 'Crear sala',
    saving: 'Creando sala...',
    error: 'No pudimos crear la sala. Intenta de nuevo.',
    setup: 'Preparar sala',
  },
  en: {
    path: '/en',
    name: 'Room name *',
    submit: 'Create room',
    saving: 'Creating room...',
    error: "We couldn't create the room. Try again.",
    setup: 'Set up room',
  },
}

for (const locale of ['es', 'en'] as const) {
  for (const mode of ['fast', 'slow', 'failure'] as const) {
    test(`Firestore loads on intent and creates once: ${locale}, ${mode}`, async ({
      page,
      request,
    }, testInfo) => {
      const labels = copy[locale]
      const roomName = `PERF-10 ${locale} ${mode}`
      const sdkRequests: { path: string; at: number }[] = []
      let release!: () => void
      const held = new Promise<void>(resolve => {
        release = resolve
      })
      let delivered = false
      // Inspect the actual script, avoiding assumptions about chunk names or IDs.
      await page.route('**/_next/static/chunks/**', async route => {
        const response = await route.fetch()
        const body = await response.text()
        if (body.includes('Could not reach Cloud Firestore backend.')) {
          sdkRequests.push({
            path: new URL(route.request().url()).pathname,
            at: Date.now(),
          })
          if (sdkRequests.length === 1 && mode !== 'fast') {
            await held
            if (mode === 'failure') {
              await route.abort('failed')
              return
            }
          }
          await route.fulfill({ response })
          delivered = true
          return
        }
        await route.fulfill({ response })
      })

      await page.goto(labels.path)
      const name = page.getByRole('textbox', { name: labels.name, exact: true })
      await expect(name).toBeEnabled()
      // Include a settled idle window to catch eager loading after hydration.
      await page.waitForTimeout(750)
      expect(sdkRequests).toEqual([])
      if (locale === 'en') {
        await page.setViewportSize({ width: 390, height: 844 })
      }
      const focusedAt = Date.now()
      await name.fill(roomName)
      await expect.poll(() => sdkRequests.length).toBe(1)
      if (mode === 'fast') await expect.poll(() => delivered).toBe(true)

      const submittedAt = Date.now()
      await page
        .getByRole('button', { name: labels.submit, exact: true })
        .click()
      if (mode !== 'fast') {
        await expect(name).toBeDisabled()
        await expect(
          page.getByText(labels.saving, { exact: true }),
        ).toBeVisible()
        // Repeated events while the download is pending must share one creation.
        await name.locator('xpath=ancestor::form').evaluate(form => {
          form.dispatchEvent(
            new Event('submit', { bubbles: true, cancelable: true }),
          )
          form.dispatchEvent(
            new Event('submit', { bubbles: true, cancelable: true }),
          )
        })
        await page.waitForTimeout(750)
        expect(sdkRequests).toHaveLength(1)
        release()
      }
      if (mode === 'failure') {
        await expect(
          page.getByText(labels.error, { exact: true }),
        ).toBeVisible()
        await expect(name).toBeEnabled()
        await expect(name).toHaveValue(roomName)
        await page
          .getByRole('button', { name: labels.submit, exact: true })
          .click()
      }
      await expect(
        page.getByRole('heading', { name: labels.setup, exact: true }),
      ).toBeVisible()
      const readyAt = Date.now()
      const roomResponse = await request.get(
        `http://127.0.0.1:${firestorePort}/v1/projects/${projectId}/databases/(default)/documents/rooms`,
      )
      expect(roomResponse.ok()).toBe(true)
      const rooms = (await roomResponse.json()).documents || []
      expect(
        rooms.filter(
          (room: { fields: { name: { stringValue: string } } }) =>
            room.fields.name.stringValue === roomName,
        ),
      ).toHaveLength(1)
      expect(
        (await readAnalyticsEvents(page)).filter(
          event => event.eventName === 'room_created',
        ),
      ).toHaveLength(1)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(page.viewportSize()!.width)
      await testInfo.attach('firestore-loading-timing', {
        body: JSON.stringify(
          {
            locale,
            mode,
            focusedAt,
            submittedAt,
            readyAt,
            sdkRequests,
            focusToRequestMs: sdkRequests[0].at - focusedAt,
            submitToSetupMs: readyAt - submittedAt,
            note:
              'Local emulator; slow/failure include controlled holds and assertions, not a production latency benchmark.',
          },
          null,
          2,
        ),
        contentType: 'application/json',
      })
    })
  }
}
