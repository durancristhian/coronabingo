# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: high-priority.spec.ts >> CB-01: preserve both tabs marks after reload
- Location: research/functional-audit-2026-09-26-evidence/high-priority.spec.ts:17:5

# Error details

```
Error: First tab mark must survive the other tab reload

expect(locator).toHaveClass(expected) failed

Locator: getByTestId('bingo-card').first().getByRole('button').first()
Expected pattern: /bg-orange-400/
Received string:  "bg-white border-b-2 border-r-2 border-gray-900 cursor-poroto flex focus:outline-none h-8 sm:h-20 items-center justify-center p-1 relative w-1/10"
Timeout: 3000ms

Call log:
  - First tab mark must survive the other tab reload getByTestId('bingo-card').first().getByRole('button').first() with timeout 3000ms
  - waiting for getByTestId('bingo-card').first().getByRole('button').first()
    10 × locator resolved to <div tabindex="0" role="button" aria-pressed="false" class="bg-white border-b-2 border-r-2 border-gray-900 cursor-poroto flex focus:outline-none h-8 sm:h-20 items-center justify-center p-1 relative w-1/10">…</div>
       - unexpected value "bg-white border-b-2 border-r-2 border-gray-900 cursor-poroto flex focus:outline-none h-8 sm:h-20 items-center justify-center p-1 relative w-1/10"

```

```yaml
- button "12"
```

# Test source

```ts
  1   | // Diagnostic probes, separate from the maintained UI regression suite.
  2   | import { Page } from '@playwright/test'
  3   | import { test, expect } from '../../tests/ui/fixtures'
  4   | import { createReadyRoom, testPlayerNames } from '../../tests/ui/room-setup'
  5   |
  6   | async function openPlayer(page: Page, name: string) {
  7   |   await page.getByTestId('player-row').filter({ hasText: name })
  8   |     .getByRole('button', { name: 'Jugar', exact: true }).click()
  9   |   await expect(page.getByTestId('bingo-card')).toHaveCount(2)
  10  | }
  11  | async function showExperiments(page: Page) {
  12  |   for (let i = 0; i < 7; i++) {
  13  |     await page.getByRole('button', { name: 'Preparar sala', exact: true }).click()
  14  |   }
  15  | }
  16  |
  17  | test('CB-01: preserve both tabs marks after reload', async ({ page }) => {
  18  |   await createReadyRoom(page, 'QA CB-01 20260926')
  19  |   const lobby = page.url()
  20  |   await openPlayer(page, testPlayerNames.player)
  21  |   const second = await page.context().newPage()
  22  |   await second.goto(page.url())
  23  |   await expect(second.getByTestId('bingo-card')).toHaveCount(2)
  24  |   const a = page.getByTestId('bingo-card').first().getByRole('button').nth(0)
  25  |   const b = second.getByTestId('bingo-card').first().getByRole('button').nth(1)
  26  |   const firstNumber = await a.innerText()
  27  |   const secondNumber = await b.innerText()
  28  |   await a.click()
  29  |   await expect(a).toHaveClass(/bg-orange-400/)
  30  |   await b.click()
  31  |   await expect(b).toHaveClass(/bg-orange-400/)
  32  |   await second.reload()
  33  |   await expect(second.getByTestId('bingo-card')).toHaveCount(2)
  34  |   await expect(second.getByTestId('bingo-card').first().getByRole('button').nth(1)).toHaveClass(/bg-orange-400/)
  35  |   const secondOnA = page.getByTestId('bingo-card').first().getByRole('button').nth(1)
  36  |   await expect(secondOnA).toHaveClass(/bg-orange-400/)
  37  |   console.log(JSON.stringify({ id: 'CB-01', lobby, firstNumber, secondNumber,
  38  |     marksAfterReload: await page.locator('[data-testid="bingo-card"] .bg-orange-400').allTextContents() }))
> 39  |   await expect(a, 'First tab mark must survive the other tab reload').toHaveClass(/bg-orange-400/, { timeout: 3000 })
      |                                                                       ^ Error: First tab mark must survive the other tab reload
  40  | })
  41  |
  42  | test('CB-02: preserve pending addition after persisted player deletion', async ({ page }) => {
  43  |   await createReadyRoom(page, 'QA CB-02 20260926')
  44  |   const lobby = page.url()
  45  |   await openPlayer(page, testPlayerNames.host)
  46  |   await page.locator('#reboot-game:visible').click()
  47  |   await page.getByRole('button', { name: 'Confirmar', exact: true }).click()
  48  |   await expect(page.getByRole('heading', { name: 'Preparar sala' })).toBeVisible()
  49  |   await page.getByRole('textbox', { name: 'Nombre *', exact: true }).fill('Carla pendiente')
  50  |   await page.getByRole('button', { name: 'Agregar persona' }).click()
  51  |   await page.locator('#players-list > div').filter({ hasText: testPlayerNames.player })
  52  |     .getByRole('button', { name: 'Eliminar persona' }).click()
  53  |   // Observe incoming deletion snapshots before saving the draft. Saving
  54  |   // immediately could mask the original loss by persisting Carla first.
  55  |   await page.waitForTimeout(1000)
  56  |   await expect(page.locator('#players-list').getByText('Carla pendiente', { exact: true })).toBeVisible()
  57  |   await page.getByRole('button', { name: 'Jugar', exact: true }).click()
  58  |   await expect(page.getByRole('heading', { name: 'Información de la sala' })).toBeVisible()
  59  |   await page.reload()
  60  |   await expect(page.getByTestId('player-row')).toHaveCount(2)
  61  |   await expect(page.getByTestId('player-row').filter({ hasText: 'Carla pendiente' })).toBeVisible()
  62  |   await expect(page.getByTestId('player-row').filter({ hasText: testPlayerNames.player })).toHaveCount(0)
  63  |   console.log(JSON.stringify({ id: 'CB-02', lobby, result: 'Ana and Carla survive save and reload' }))
  64  | })
  65  |
  66  | test('CB-03: room-code protection cannot be bypassed through setup', async ({ page: host, playerPage: visitor }) => {
  67  |   await createReadyRoom(host, 'QA CB-03 20260926', { useOnlineCaller: true })
  68  |   const lobby = host.url()
  69  |   await host.goto(lobby + '/admin')
  70  |   await expect(host.getByRole('heading', { name: 'Preparar sala' })).toBeVisible()
  71  |   await showExperiments(host)
  72  |   await host.getByRole('checkbox', { name: 'Activar código para el admin', exact: true }).check()
  73  |   await host.getByRole('button', { name: 'Jugar', exact: true }).click()
  74  |   await expect(host.getByTestId('player-row')).toHaveCount(2)
  75  |   await host.getByTestId('player-row').filter({ hasText: testPlayerNames.host })
  76  |     .getByRole('button', { name: 'Jugar', exact: true }).click()
  77  |   await expect(host.getByText('Ingrese el código de acceso a la sala')).toBeVisible()
  78  |   const hostURL = host.url()
  79  |   await visitor.goto(hostURL)
  80  |   await expect(visitor.getByText('Ingrese el código de acceso a la sala')).toBeVisible()
  81  |   await visitor.goto(lobby + '/admin')
  82  |   await expect(visitor.getByRole('heading', { name: 'Preparar sala' })).toBeVisible()
  83  |   await showExperiments(visitor)
  84  |   const exposed = visitor.locator('label.bg-green-100 input[type="checkbox"]')
  85  |   await expect(exposed).toHaveCount(3)
  86  |   // Synthetic ephemeral code stays in memory; do not log its contents.
  87  |   const tokens = await exposed.evaluateAll(inputs => inputs.map(input => input.id.replace(/\d+$/, '')))
  88  |   await visitor.goto(hostURL)
  89  |   await expect(visitor.getByText('Ingrese el código de acceso a la sala')).toBeVisible()
  90  |   for (const token of tokens) {
  91  |     await visitor.locator(`label:has(input[id^="${token}"])`).first().click()
  92  |   }
  93  |   await visitor.getByRole('button', { name: 'Ingresar', exact: true }).click()
  94  |   await expect(visitor.getByRole('button', { name: 'Próximo número' })).toBeVisible()
  95  |   await visitor.getByRole('button', { name: 'Próximo número' }).click()
  96  |   await expect(visitor.getByTestId('called-number')).toHaveCount(1)
  97  |   console.log(JSON.stringify({ id: 'CB-03', lobby, codeGateInitiallyShown: true,
  98  |     codeRevealedInSetup: true, visitorReachedHostControls: true, visitorDrewNumber: true }))
  99  |   await expect(visitor.getByRole('button', { name: 'Próximo número' }),
  100 |     'A visitor must not obtain host controls by reading the code from setup').toHaveCount(0, { timeout: 3000 })
  101 | })
  102 |
```
