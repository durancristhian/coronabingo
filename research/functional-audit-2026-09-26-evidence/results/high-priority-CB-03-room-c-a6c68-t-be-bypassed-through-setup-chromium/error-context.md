# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: high-priority.spec.ts >> CB-03: room-code protection cannot be bypassed through setup
- Location: research/functional-audit-2026-09-26-evidence/high-priority.spec.ts:66:5

# Error details

```
Error: A visitor must not obtain host controls by reading the code from setup

expect(locator).toHaveCount(expected) failed

Locator:  getByRole('button', { name: 'Próximo número' })
Expected: 0
Received: 1
Timeout:  3000ms

Call log:
  - A visitor must not obtain host controls by reading the code from setup getByRole('button', { name: 'Próximo número' }) with timeout 3000ms
  - waiting for getByRole('button', { name: 'Próximo número' })
    10 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [ref=f2e1]:
  - generic [ref=f2e2]:
    - main [ref=f2e3]:
      - generic [ref=f2e7]:
        - heading [level=1] [ref=f2e8]:
          - link "Coronabingo" [ref=f2e9] [cursor=pointer]:
            - /url: /
        - combobox "language" [ref=f2e12]:
          - option "Español" [selected]
          - option "English"
      - generic [ref=f2e19]:
        - heading "Hola Ana anfitriona, estás en la sala QA CB-03 20260926" [level=2] [ref=f2e21]
        - generic [ref=f2e23]:
          - generic [ref=f2e24]:
            - generic [ref=f2e25]:
              - heading "Últimos números" [level=2] [ref=f2e27]
              - generic [ref=f2e28]: "24"
              - generic [ref=f2e33]:
                - paragraph [ref=f2e34]:
                  - generic [ref=f2e35]: El caballo
                  - generic "El caballo" [ref=f2e37]
                - paragraph [ref=f2e38]:
                  - link "¿Qué es esto?" [ref=f2e39] [cursor=pointer]:
                    - /url: https://es.wikipedia.org/wiki/Quiniela_(Argentina)
            - generic [ref=f2e40]:
              - generic [ref=f2e41]:
                - heading "Bolillero" [level=2] [ref=f2e42]
                - generic [ref=f2e43]:
                  - button "Próximo número" [active] [ref=f2e44] [cursor=pointer]
                  - generic [ref=f2e53]:
                    - button "1" [ref=f2e54]
                    - button "2" [ref=f2e56]
                    - button "3" [ref=f2e58]
                    - button "4" [ref=f2e60]
                    - button "5" [ref=f2e62]
                    - button "6" [ref=f2e64]
                    - button "7" [ref=f2e66]
                    - button "8" [ref=f2e68]
                    - button "9" [ref=f2e70]
                    - button "10" [ref=f2e72]
                    - button "11" [ref=f2e74]
                    - button "12" [ref=f2e76]
                    - button "13" [ref=f2e78]
                    - button "14" [ref=f2e80]
                    - button "15" [ref=f2e82]
                    - button "16" [ref=f2e84]
                    - button "17" [ref=f2e86]
                    - button "18" [ref=f2e88]
                    - button "19" [ref=f2e90]
                    - button "20" [ref=f2e92]
                    - button "21" [ref=f2e94]
                    - button "22" [ref=f2e96]
                    - button "23" [ref=f2e98]
                    - button "24" [ref=f2e100]
                    - button "25" [ref=f2e102]
                    - button "26" [ref=f2e104]
                    - button "27" [ref=f2e106]
                    - button "28" [ref=f2e108]
                    - button "29" [ref=f2e110]
                    - button "30" [ref=f2e112]
                    - button "31" [ref=f2e114]
                    - button "32" [ref=f2e116]
                    - button "33" [ref=f2e118]
                    - button "34" [ref=f2e120]
                    - button "35" [ref=f2e122]
                    - button "36" [ref=f2e124]
                    - button "37" [ref=f2e126]
                    - button "38" [ref=f2e128]
                    - button "39" [ref=f2e130]
                    - button "40" [ref=f2e132]
                    - button "41" [ref=f2e134]
                    - button "42" [ref=f2e136]
                    - button "43" [ref=f2e138]
                    - button "44" [ref=f2e140]
                    - button "45" [ref=f2e142]
                    - button "46" [ref=f2e144]
                    - button "47" [ref=f2e146]
                    - button "48" [ref=f2e148]
                    - button "49" [ref=f2e150]
                    - button "50" [ref=f2e152]
                    - button "51" [ref=f2e154]
                    - button "52" [ref=f2e156]
                    - button "53" [ref=f2e158]
                    - button "54" [ref=f2e160]
                    - button "55" [ref=f2e162]
                    - button "56" [ref=f2e164]
                    - button "57" [ref=f2e166]
                    - button "58" [ref=f2e168]
                    - button "59" [ref=f2e170]
                    - button "60" [ref=f2e172]
                    - button "61" [ref=f2e174]
                    - button "62" [ref=f2e176]
                    - button "63" [ref=f2e178]
                    - button "64" [ref=f2e180]
                    - button "65" [ref=f2e182]
                    - button "66" [ref=f2e184]
                    - button "67" [ref=f2e186]
                    - button "68" [ref=f2e188]
                    - button "69" [ref=f2e190]
                    - button "70" [ref=f2e192]
                    - button "71" [ref=f2e194]
                    - button "72" [ref=f2e196]
                    - button "73" [ref=f2e198]
                    - button "74" [ref=f2e200]
                    - button "75" [ref=f2e202]
                    - button "76" [ref=f2e204]
                    - button "77" [ref=f2e206]
                    - button "78" [ref=f2e208]
                    - button "79" [ref=f2e210]
                    - button "80" [ref=f2e212]
                    - button "81" [ref=f2e214]
                    - button "82" [ref=f2e216]
                    - button "83" [ref=f2e218]
                    - button "84" [ref=f2e220]
                    - button "85" [ref=f2e222]
                    - button "86" [ref=f2e224]
                    - button "87" [ref=f2e226]
                    - button "88" [ref=f2e228]
                    - button "89" [ref=f2e230]
                    - button "90" [ref=f2e232]
              - generic [ref=f2e235]:
                - tablist [ref=f2e236]:
                  - generic [ref=f2e237]:
                    - tab [ref=f2e238]:
                      - button [ref=f2e239] [cursor=pointer]
                    - tab [ref=f2e243]:
                      - button [ref=f2e244] [cursor=pointer]
                    - tab [ref=f2e248]:
                      - button [ref=f2e249] [cursor=pointer]
                    - tab [ref=f2e253]:
                      - button [ref=f2e254] [cursor=pointer]
                - tabpanel
                - tabpanel
                - tabpanel
                - tabpanel
          - generic [ref=f2e258]:
            - generic [ref=f2e260]:
              - paragraph [ref=f2e261]: Cartón Nº 1409
              - generic [ref=f2e262]:
                - button "1" [ref=f2e263]
                - button "15" [ref=f2e266]
                - button "32" [ref=f2e270]
                - button "52" [ref=f2e274]
                - button "61" [ref=f2e277]
                - button "5" [ref=f2e282]
                - button "21" [ref=f2e286]
                - button "34" [ref=f2e289]
                - button "65" [ref=f2e294]
                - button "79" [ref=f2e297]
                - button "18" [ref=f2e302]
                - button "27" [ref=f2e305]
                - button "43" [ref=f2e309]
                - button "58" [ref=f2e312]
                - button "85" [ref=f2e317]
            - generic [ref=f2e321]:
              - paragraph [ref=f2e322]: Cartón Nº 1410
              - generic [ref=f2e323]:
                - button "25" [ref=f2e326]
                - button "36" [ref=f2e329]
                - button "53" [ref=f2e333]
                - button "66" [ref=f2e336]
                - button "82" [ref=f2e340]
                - button "12" [ref=f2e344]
                - button "38" [ref=f2e348]
                - button "40" [ref=f2e351]
                - button "70" [ref=f2e356]
                - button "84" [ref=f2e359]
                - button "9" [ref=f2e362]
                - button "19" [ref=f2e365]
                - button "42" [ref=f2e370]
                - button "67" [ref=f2e374]
                - button "76" [ref=f2e377]
      - generic [ref=f2e383]:
        - heading "Coronabingo y las noticias" [level=2] [ref=f2e384]
        - generic [ref=f2e385]:
          - paragraph [ref=f2e386]:
            - text: Creado por
            - link "Cristhian Duran" [ref=f2e387] [cursor=pointer]:
              - /url: https://twitter.com/DuranCristhian
          - list [ref=f2e389]:
            - listitem [ref=f2e390]:
              - button "Doname un café" [ref=f2e391] [cursor=pointer]
            - listitem [ref=f2e397]:
              - link "Feedback" [ref=f2e398] [cursor=pointer]:
                - /url: https://forms.gle/egSBrsKSFnEgabff7
            - listitem [ref=f2e403]:
              - link "Twitter" [ref=f2e404] [cursor=pointer]:
                - /url: https://twitter.com/corona_bingo
    - generic: Código correcto. Espere...
  - button "Open Next.js Dev Tools" [ref=f2e414] [cursor=pointer]
  - alert [ref=f2e418]
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
  39  |   await expect(a, 'First tab mark must survive the other tab reload').toHaveClass(/bg-orange-400/, { timeout: 3000 })
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
> 100 |     'A visitor must not obtain host controls by reading the code from setup').toHaveCount(0, { timeout: 3000 })
      |                                                                               ^ Error: A visitor must not obtain host controls by reading the code from setup
  101 | })
  102 |
```
