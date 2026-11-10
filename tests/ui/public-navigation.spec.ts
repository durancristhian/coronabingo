import { test, expect } from './fixtures'
import { Locator } from '@playwright/test'

async function expectProjectRhythm(project: Locator) {
  const centers = await project.locator('a').evaluateAll(links =>
    links.map(link => {
      const range = document.createRange()
      range.selectNodeContents(link)
      const rect = range.getBoundingClientRect()
      return rect.y + rect.height / 2
    }),
  )
  const steps = centers.slice(1).map((center, index) => center - centers[index])
  expect(steps).toHaveLength(3)
  expect(Math.max(...steps) - Math.min(...steps)).toBeLessThanOrEqual(1)
}

for (const lang of ['es', 'en']) {
  const prefix = lang === 'en' ? '/en' : ''
  test(`${lang} content navigation stays on the current origin in HTML and Markdown`, async ({
    page,
    request,
  }) => {
    for (const name of ['about', 'contact', 'privacy']) {
      const path = `${prefix}/${name}`
      const response = await page.goto(path)
      const currentOrigin = new URL(page.url()).origin
      const expected = [
        prefix || '/',
        ...['about', 'contact', 'privacy'].map(name => `${prefix}/${name}`),
      ]
      const links = page.locator('article nav a[href^="/"]')
      expect(
        await links.evaluateAll(elements =>
          elements.map(element => element.getAttribute('href')),
        ),
      ).toEqual(expected)
      const initial = await response!.text()
      for (const href of expected) expect(initial).toContain(`href="${href}"`)
      const markdown = await request.get(path, {
        headers: { Accept: 'text/markdown' },
      })
      expect(
        [...(await markdown.text()).matchAll(/\]\((\/[^)]*)\)/g)].map(
          match => match[1],
        ),
      ).toEqual(expected)
      await expect(
        page.locator('article a[href="mailto:durancristhiandev@gmail.com"]'),
      ).toHaveCount(1)
      await expect(
        page.locator('article a[href="https://twitter.com/corona_bingo"]'),
      ).toHaveCount(1)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://coronabingo.com.ar${path}`,
      )
      await page
        .locator(
          `article a[href="${prefix}/${
            name === 'about' ? 'contact' : 'about'
          }"]`,
        )
        .click()
      expect(new URL(page.url()).origin).toBe(currentOrigin)
      expect(new URL(page.url()).pathname).toBe(
        `${prefix}/${name === 'about' ? 'contact' : 'about'}`,
      )
      await expect(page.locator('#language')).toHaveValue(lang)
    }
  })

  test(`${lang} footer groups reflow together and retain link destinations`, async ({
    page,
  }, testInfo) => {
    await page.goto(`${prefix}/contact`)
    const footer = page.locator('footer')
    const project = footer.locator('section[aria-labelledby="footer-project"]')
    const participate = footer.locator(
      'nav[aria-labelledby="footer-participate"]',
    )
    await expect(project.locator('h3')).toHaveText(
      lang === 'es' ? 'El proyecto' : 'The project',
    )
    await expect(participate.locator('h3')).toHaveText(
      lang === 'es' ? 'Participa' : 'Get involved',
    )
    for (const name of ['about', 'contact', 'privacy'])
      await expect(project.locator(`a[href="${prefix}/${name}"]`)).toHaveCount(
        1,
      )
    for (const [id, href] of [
      ['feedback-form', 'https://forms.gle/egSBrsKSFnEgabff7'],
      ['coronabingo-twitter', 'https://twitter.com/corona_bingo'],
      ['donate', 'https://cafecito.app/durancristhian'],
    ]) {
      await expect(participate.locator(`#${id}`)).toHaveAttribute('href', href)
      await expect(participate.locator(`#${id}`)).toHaveAttribute(
        'target',
        '_blank',
      )
    }
    for (const width of [320, 768, 1024, 1280]) {
      await page.setViewportSize({ width, height: 800 })
      await footer.scrollIntoViewIfNeeded()
      const first = (await project.boundingBox())!
      const second = (await participate.boundingBox())!
      if (width < 1024) {
        expect(Math.abs(first.x - second.x)).toBeLessThan(1)
        expect(second.y).toBeGreaterThanOrEqual(first.y + first.height)
      } else {
        expect(Math.abs(first.y - second.y)).toBeLessThan(1)
        expect(second.x).toBeGreaterThan(first.x + first.width)
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true)
      for (const link of await footer.locator('.cb-footer-list a').all())
        expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44)
      await expectProjectRhythm(project)
      if (width === 320 || width === 1280)
        await footer.screenshot({
          path: testInfo.outputPath(`footer-${lang}-${width}.png`),
        })
    }
    const firstLink = project.locator(`nav a[href="${prefix}/about"]`)
    await firstLink.focus()
    await expect(firstLink).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`${prefix}/about$`))
  })

  test.describe(`${lang} touch footer`, () => {
    test.use({ hasTouch: true })
    test('creator and navigation share the same row spacing', async ({
      page,
    }) => {
      await page.goto(`${prefix}/contact`)
      for (const width of [320, 1280]) {
        await page.setViewportSize({ width, height: 800 })
        await expectProjectRhythm(
          page.locator('footer section[aria-labelledby="footer-project"]'),
        )
      }
    })
  })
}
