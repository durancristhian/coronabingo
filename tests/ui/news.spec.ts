import { test, expect } from './fixtures'

// Author/date/media framing follows the page; the post text stays Spanish.
const altPatterns = {
  es: /^Post de .+ \(@\w+\) del \d+ de \w+ de 2020: «.+»\. Incluye .+\.$/,
  en: /^Post by .+ \(@\w+\) on \w+ \d+, 2020: “.+”\. Includes .+\.$/,
}

const postIds = [
  '1266490485650198528',
  '1267934678784389121',
  '1246110709005660163',
  '1279431298990379012',
]

for (const locale of ['es', 'en'] as const) {
  test(`${locale}: news posts are static images linked to X`, async ({
    page,
  }) => {
    const providerRequests: string[] = []
    page.on('request', request => {
      const host = new URL(request.url()).hostname
      if (/(^|\.)(twitter\.com|twimg\.com|x\.com)$/.test(host)) {
        providerRequests.push(request.url())
      }
    })
    await page.goto(locale === 'en' ? '/en' : '/')

    const links = page.locator('footer ul a:has(img)')
    await expect(links).toHaveCount(postIds.length)
    for (const [index, id] of postIds.entries()) {
      const link = links.nth(index)
      const image = link.locator('img')
      await expect(link).toHaveAttribute(
        'href',
        `https://twitter.com/i/web/status/${id}`,
      )
      await expect(image).toHaveAttribute(
        'src',
        new RegExp(`^/news/${id}\\.[0-9a-f]{12}\\.webp$`),
      )
      await expect(image).toHaveAttribute('alt', altPatterns[locale])
      await expect(image).toHaveAttribute('loading', 'lazy')
      // The image description is the link's accessible name.
      await expect(link).toHaveAccessibleName(
        (await image.getAttribute('alt')) ?? '',
      )
    }

    await links.last().scrollIntoViewIfNeeded()
    for (const image of await links.locator('img').all()) {
      await expect
        .poll(() =>
          image.evaluate(img => (img as HTMLImageElement).naturalWidth),
        )
        .toBe(550)
    }
    expect(providerRequests).toEqual([])

    // Content-versioned filenames make the images safe to cache forever.
    const response = await page.request.get(
      (await links
        .first()
        .locator('img')
        .getAttribute('src')) ?? '',
    )
    expect(response.headers()['cache-control']).toBe(
      'public, max-age=31536000, immutable',
    )
  })

  test(`${locale}: news posts fit a 320px screen without horizontal scroll`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 })
    await page.goto(locale === 'en' ? '/en' : '/')
    const images = page.locator('footer ul img')
    await images.last().scrollIntoViewIfNeeded()
    for (const image of await images.all()) {
      const box = await image.boundingBox()
      expect(box?.x).toBeGreaterThanOrEqual(0)
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(320)
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320)
  })
}
