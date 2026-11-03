import { readFileSync } from 'node:fs'
import { readAnalyticsEvents } from './analytics'
import { firestorePort, projectId } from './environment'
import { test, expect } from './fixtures'
import { createReadyRoom, testPlayerNames } from './room-setup'

for (const locale of ['es', 'en']) {
  test(`${locale}: tools block pending writes and retry rejected writes`, async ({
    page,
    request,
  }) => {
    await createReadyRoom(page, `Pending tools ${locale}`)
    const lobbyPath = new URL(page.url()).pathname
    if (locale === 'en') {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(`/en${lobbyPath}`)
    }
    await page
      .getByTestId('player-row')
      .filter({ hasText: testPlayerNames.host })
      .getByRole('button', {
        name: locale === 'en' ? 'Play' : 'Jugar',
        exact: true,
      })
      .click()
    await expect(page.getByTestId('bingo-card')).toHaveCount(2)

    const rulesURL = `http://127.0.0.1:${firestorePort}/emulator/v1/projects/${projectId}:securityRules`
    const rules = readFileSync('tests/ui/firestore.rules', 'utf8')
    const deniedRules = rules.replace(
      'match /rooms/{roomId} {\n      allow read, write: if true;',
      'match /rooms/{roomId} {\n      allow read: if true;\n      allow write: if false;',
    )
    const setRules = async (content: string) => {
      const response = await request.put(rulesURL, {
        data: { rules: { files: [{ name: 'firestore.rules', content }] } },
      })
      expect(response.ok()).toBeTruthy()
    }
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))

    for (const tool of ['celebration', 'sound']) {
      const eventName =
        tool === 'celebration' ? 'celebration_used' : 'sound_used'
      await page
        .locator(
          tool === 'celebration' ? '#celebrations:visible' : '#sounds:visible',
        )
        .click()
      const dialog = page.getByRole('dialog')
      const button = dialog
        .locator(tool === 'celebration' ? '#click-confetti' : '#play-sound')
        .first()
      const events = async () =>
        (await readAnalyticsEvents(page)).filter(
          event => event.eventName === eventName,
        )
      const previousErrors = errors.length
      try {
        await setRules(deniedRules)
        await button.click()
        await expect.poll(() => errors.length).toBe(previousErrors + 1)
        expect(errors[previousErrors]).toMatch(/permission|insufficient/i)
        await expect(button).toBeEnabled()
        expect(await events()).toEqual([])
      } finally {
        await setRules(rules)
      }

      try {
        await page.context().setOffline(true)
        await button.evaluate(element => {
          const button = element as HTMLButtonElement
          button.click()
          button.click()
        })
        await expect(button).toBeDisabled()
        const controls = dialog.locator(
          tool === 'celebration' ? '[id^="click-"]' : '#play-sound',
        )
        for (const control of await controls.all())
          await expect(control).toBeDisabled()
        expect(await events()).toEqual([])
      } finally {
        await page.context().setOffline(false)
      }
      await expect.poll(events).toHaveLength(1)
      await expect(button).toBeEnabled()
      if (tool === 'celebration') {
        // Hiding is a second successful write and must not log another use.
        await button.click()
        await expect(button).toHaveAccessibleName(
          locale === 'en' ? 'Show confetti' : 'Mostrar confeti',
        )
        expect(await events()).toHaveLength(1)
      }
      await dialog.locator('#close-modal').click()
    }
  })
}
