// Diagnostic probes, separate from the maintained UI regression suite.
import { Page } from '@playwright/test'
import { test, expect } from '../../tests/ui/fixtures'
import { createReadyRoom, testPlayerNames } from '../../tests/ui/room-setup'

async function openPlayer(page: Page, name: string) {
  await page
    .getByTestId('player-row')
    .filter({ hasText: name })
    .getByRole('button', { name: 'Jugar', exact: true })
    .click()
  await expect(page.getByTestId('bingo-card')).toHaveCount(2)
}
async function showExperiments(page: Page) {
  for (let i = 0; i < 7; i++) {
    await page
      .getByRole('button', { name: 'Preparar sala', exact: true })
      .click()
  }
}

test('CB-01: preserve both tabs marks after reload', async ({ page }) => {
  await createReadyRoom(page, 'QA CB-01 20260926')
  const lobby = page.url()
  await openPlayer(page, testPlayerNames.player)
  const second = await page.context().newPage()
  await second.goto(page.url())
  await expect(second.getByTestId('bingo-card')).toHaveCount(2)
  const a = page
    .getByTestId('bingo-card')
    .first()
    .getByRole('button')
    .nth(0)
  const b = second
    .getByTestId('bingo-card')
    .first()
    .getByRole('button')
    .nth(1)
  const firstNumber = await a.innerText()
  const secondNumber = await b.innerText()
  await a.click()
  await expect(a).toHaveClass(/bg-orange-400/)
  await b.click()
  await expect(b).toHaveClass(/bg-orange-400/)
  await second.reload()
  await expect(second.getByTestId('bingo-card')).toHaveCount(2)
  await expect(
    second
      .getByTestId('bingo-card')
      .first()
      .getByRole('button')
      .nth(1),
  ).toHaveClass(/bg-orange-400/)
  const secondOnA = page
    .getByTestId('bingo-card')
    .first()
    .getByRole('button')
    .nth(1)
  await expect(secondOnA).toHaveClass(/bg-orange-400/)
  console.log(
    JSON.stringify({
      id: 'CB-01',
      lobby,
      firstNumber,
      secondNumber,
      marksAfterReload: await page
        .locator('[data-testid="bingo-card"] .bg-orange-400')
        .allTextContents(),
    }),
  )
  await expect(
    a,
    'First tab mark must survive the other tab reload',
  ).toHaveClass(/bg-orange-400/, { timeout: 3000 })
})

test('CB-02: preserve pending addition after persisted player deletion', async ({
  page,
}) => {
  await createReadyRoom(page, 'QA CB-02 20260926')
  const lobby = page.url()
  await openPlayer(page, testPlayerNames.host)
  await page.locator('#reboot-game:visible').click()
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Preparar sala' }),
  ).toBeVisible()
  await page
    .getByRole('textbox', { name: 'Nombre *', exact: true })
    .fill('Carla pendiente')
  await page.getByRole('button', { name: 'Agregar persona' }).click()
  await page
    .locator('#players-list > div')
    .filter({ hasText: testPlayerNames.player })
    .getByRole('button', { name: 'Eliminar persona' })
    .click()
  // Observe incoming deletion snapshots before saving the draft. Saving
  // immediately could mask the original loss by persisting Carla first.
  await page.waitForTimeout(1000)
  await expect(
    page.locator('#players-list').getByText('Carla pendiente', { exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Información de la sala' }),
  ).toBeVisible()
  await page.reload()
  await expect(page.getByTestId('player-row')).toHaveCount(2)
  await expect(
    page.getByTestId('player-row').filter({ hasText: 'Carla pendiente' }),
  ).toBeVisible()
  await expect(
    page.getByTestId('player-row').filter({ hasText: testPlayerNames.player }),
  ).toHaveCount(0)
  console.log(
    JSON.stringify({
      id: 'CB-02',
      lobby,
      result: 'Ana and Carla survive save and reload',
    }),
  )
})

test('CB-03: room-code protection cannot be bypassed through setup', async ({
  page: host,
  playerPage: visitor,
}) => {
  await createReadyRoom(host, 'QA CB-03 20260926', { useOnlineCaller: true })
  const lobby = host.url()
  await host.goto(lobby + '/admin')
  await expect(
    host.getByRole('heading', { name: 'Preparar sala' }),
  ).toBeVisible()
  await showExperiments(host)
  await host
    .getByRole('checkbox', {
      name: 'Activar código para el admin',
      exact: true,
    })
    .check()
  await host.getByRole('button', { name: 'Jugar', exact: true }).click()
  await expect(host.getByTestId('player-row')).toHaveCount(2)
  await host
    .getByTestId('player-row')
    .filter({ hasText: testPlayerNames.host })
    .getByRole('button', { name: 'Jugar', exact: true })
    .click()
  await expect(
    host.getByText('Ingrese el código de acceso a la sala'),
  ).toBeVisible()
  const hostURL = host.url()
  await visitor.goto(hostURL)
  await expect(
    visitor.getByText('Ingrese el código de acceso a la sala'),
  ).toBeVisible()
  await visitor.goto(lobby + '/admin')
  await expect(
    visitor.getByRole('heading', { name: 'Preparar sala' }),
  ).toBeVisible()
  await showExperiments(visitor)
  const exposed = visitor.locator('label.bg-green-100 input[type="checkbox"]')
  await expect(exposed).toHaveCount(3)
  // Synthetic ephemeral code stays in memory; do not log its contents.
  const tokens = await exposed.evaluateAll(inputs =>
    inputs.map(input => input.id.replace(/\d+$/, '')),
  )
  await visitor.goto(hostURL)
  await expect(
    visitor.getByText('Ingrese el código de acceso a la sala'),
  ).toBeVisible()
  for (const token of tokens) {
    await visitor
      .locator(`label:has(input[id^="${token}"])`)
      .first()
      .click()
  }
  await visitor.getByRole('button', { name: 'Ingresar', exact: true }).click()
  await expect(
    visitor.getByRole('button', { name: 'Próximo número' }),
  ).toBeVisible()
  await visitor.getByRole('button', { name: 'Próximo número' }).click()
  await expect(visitor.getByTestId('called-number')).toHaveCount(1)
  console.log(
    JSON.stringify({
      id: 'CB-03',
      lobby,
      codeGateInitiallyShown: true,
      codeRevealedInSetup: true,
      visitorReachedHostControls: true,
      visitorDrewNumber: true,
    }),
  )
  await expect(
    visitor.getByRole('button', { name: 'Próximo número' }),
    'A visitor must not obtain host controls by reading the code from setup',
  ).toHaveCount(0, { timeout: 3000 })
})
