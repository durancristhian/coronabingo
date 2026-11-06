import { readFileSync } from 'node:fs'
import { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { firestorePort, projectId } from './environment'
import { createReadyRoom, testPlayerNames } from './room-setup'

async function openHost(page: Page) {
  await page
    .getByTestId('player-row')
    .filter({ hasText: testPlayerNames.host })
    .getByRole('button', { name: 'Jugar', exact: true })
    .click()
  await expect(page.getByTestId('bingo-card')).toHaveCount(2)
}

for (const online of [false, true]) {
  test(`concurrent hosts retain both ${
    online ? 'online' : 'physical'
  } calls`, async ({ page: first, playerPage: second }) => {
    await createReadyRoom(first, 'Concurrent calls', {
      useOnlineCaller: online,
    })
    await second.goto(first.url())
    await openHost(first)
    await openHost(second)
    const control = (page: Page, number: string) =>
      online
        ? page.getByRole('button', { name: 'Próximo número' })
        : page
            .locator('#ticket-numbers:visible')
            .getByRole('button', { name: number, exact: true })
    await Promise.all([
      control(first, '7').click(),
      control(second, '8').click(),
    ])
    for (const page of [first, second]) {
      await expect(page.getByTestId('called-number')).toHaveCount(2)
      const values = await page.getByTestId('called-number').allTextContents()
      expect(new Set(values).size).toBe(2)
      if (!online) expect(values.sort()).toEqual(['7', '8'])
    }
  })
}

test('remote calls preserve unsaved room setup choices', async ({
  page: setup,
  playerPage: host,
}) => {
  await createReadyRoom(setup, 'Setup draft', { useOnlineCaller: true })
  const lobbyPath = new URL(setup.url()).pathname
  await host.goto(lobbyPath)
  await openHost(host)
  await setup.goto(`${lobbyPath}/admin`)
  const spinner = setup.getByRole('checkbox', { name: 'Usar bolillero online' })
  await spinner.uncheck()
  await host.getByRole('button', { name: 'Próximo número' }).click()
  await expect(host.getByTestId('called-number')).toHaveCount(1)
  await expect(spinner).not.toBeChecked()
})

for (const locale of ['es', 'en']) {
  test(`${locale}: denied player deletion preserves the roster and permits retry`, async ({
    page,
    request,
  }) => {
    await createReadyRoom(page, 'Denied removal')
    const lobbyPath = new URL(page.url()).pathname
    await page.goto(`${locale === 'en' ? '/en' : ''}${lobbyPath}/admin`)
    if (locale === 'en') await page.setViewportSize({ width: 390, height: 844 })
    const row = page
      .locator('#players-list > div')
      .filter({ hasText: testPlayerNames.player })
    const remove = row.getByRole('button', {
      name: locale === 'en' ? 'Remove player' : 'Eliminar persona',
    })
    const rules = readFileSync('tests/ui/firestore.rules', 'utf8')
    const denied = rules.replace(
      'match /players/{playerId} {\n        allow read, write: if true;',
      'match /players/{playerId} {\n        allow read: if true;\n        allow write: if false;',
    )
    const rulesURL = `http://127.0.0.1:${firestorePort}/emulator/v1/projects/${projectId}:securityRules`
    const setRules = async (content: string) => {
      const response = await request.put(rulesURL, {
        data: { rules: { files: [{ name: 'firestore.rules', content }] } },
      })
      expect(response.ok()).toBeTruthy()
    }
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    try {
      await setRules(denied)
      await remove.click()
      await expect(
        page.getByRole('alert').filter({
          hasText: locale === 'en' ? "We couldn't remove" : 'No pudimos quitar',
        }),
      ).toBeVisible()
      await expect(row).toBeVisible()
      await expect(remove).toBeEnabled()
      expect(errors).toEqual([])
    } finally {
      await setRules(rules)
    }
    await remove.click()
    await expect(row).toHaveCount(0)
    // Absence during a loading/error screen is not a completed deletion.
    await expect(page.locator('#players-list > div')).toHaveCount(1)
    await page.reload()
    await expect(page.locator('#players-list > div')).toHaveCount(1)
  })

  test(`${locale}: missing room shows its specific message`, async ({
    page,
  }) => {
    await page.goto(`${locale === 'en' ? '/en' : ''}/room/missing-${locale}`)
    await expect(
      page.getByText(
        locale === 'en' ? "This room doesn't exist." : 'La sala no existe.',
      ),
    ).toBeVisible()
  })
}
