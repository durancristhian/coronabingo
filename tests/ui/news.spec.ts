import { test, expect } from './fixtures'

const postIds = [
  '1266490485650198528',
  '1267934678784389121',
  '1246110709005660163',
  '1279431298990379012',
]

for (const locale of ['es', 'en']) {
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
      await expect(image).toHaveAttribute('src', `/news/${id}.webp`)
      await expect(image).toHaveAttribute('alt', /^Post de .+«.+»/)
      await expect(image).toHaveAttribute('lang', 'es')
      await expect(image).toHaveAttribute('loading', 'lazy')
      // The quoted post is the link's accessible name.
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
  })
}
