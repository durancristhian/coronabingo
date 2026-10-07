import { Page } from '@playwright/test'
import { test, expect } from './fixtures'
import { createRoom } from './room-setup'

const origin = 'https://coronabingo.com.ar'
const alternates = [
  { language: 'es', url: `${origin}/` },
  { language: 'en', url: `${origin}/en` },
  { language: 'x-default', url: `${origin}/` },
]

async function readMetadata(page: Page, html?: string) {
  return page.evaluate(source => {
    const doc = source
      ? new DOMParser().parseFromString(source, 'text/html')
      : document
    const contents = (selector: string, attribute: string) =>
      Array.from(doc.head.querySelectorAll(selector), element =>
        element.getAttribute(attribute),
      )

    return {
      title: doc.title,
      canonical: contents('link[rel="canonical"]', 'href'),
      alternates: Array.from(
        doc.head.querySelectorAll('link[rel="alternate"][hreflang]'),
        element => ({
          language: element.getAttribute('hreflang'),
          url: element.getAttribute('href'),
        }),
      ),
      robots: contents('meta[name="robots"]', 'content'),
      description: contents('meta[name="description"]', 'content'),
      ogTitle: contents('meta[property="og:title"]', 'content'),
      ogDescription: contents('meta[property="og:description"]', 'content'),
      ogUrl: contents('meta[property="og:url"]', 'content'),
      twitterTitle: contents('meta[name="twitter:title"]', 'content'),
      twitterDescription: contents(
        'meta[name="twitter:description"]',
        'content',
      ),
      twitterUrl: contents('meta[name="twitter:url"]', 'content'),
    }
  }, html)
}

for (const locale of ['es', 'en']) {
  const canonical = locale === 'es' ? `${origin}/` : `${origin}/en`
  const title =
    locale === 'es'
      ? 'Bingo online gratis con amigos | Coronabingo'
      : 'Free online bingo with friends | Coronabingo'

  test(`${locale} homepage metadata is stable across aliases, query and hydration`, async ({
    page,
  }) => {
    const paths = locale === 'es' ? ['/', '/es', '/es/'] : ['/en', '/en/']
    for (const path of paths) {
      const response = await page.goto(`${path}?seo_test=1#tutorial`)
      expect(response?.status()).toBe(200)
      const initial = await readMetadata(page, await response!.text())
      expect(initial).toMatchObject({
        title,
        canonical: [canonical],
        alternates,
        robots: [],
        ogTitle: [title],
        twitterTitle: [title],
        ogUrl: [canonical],
        twitterUrl: [canonical],
      })
      expect(initial.description).toHaveLength(1)
      expect(initial.description[0]).toContain(
        locale === 'es' ? 'Sin registro' : 'No sign-up',
      )
      expect(initial.ogDescription).toEqual(initial.description)
      expect(initial.twitterDescription).toEqual(initial.description)

      // Locale controls become usable after hydration. Changing language also
      // exercises next/head replacement during a real client-side navigation.
      await page
        .locator('#language')
        .selectOption(locale === 'es' ? 'en' : 'es')
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        locale === 'es' ? `${origin}/en` : `${origin}/`,
      )
      await page.locator('#language').selectOption(locale)
      await expect.poll(() => readMetadata(page)).toEqual(initial)
    }
  })

  test(`${locale} room, setup and player pages are noindex before and after hydration`, async ({
    page,
  }) => {
    const prefix = locale === 'es' ? '' : '/en'
    for (const child of ['', '/admin', '/seo-private-player']) {
      const response = await page.goto(
        `${prefix}/room/seo-private-room${child}?secret=seo-private-query`,
      )
      const initial = await readMetadata(page, await response!.text())
      expect(initial).toMatchObject({
        canonical: [],
        alternates: [],
        robots: ['noindex'],
        ogUrl: [],
        twitterUrl: [],
      })
      expect(initial.description).toHaveLength(1)
      expect(initial.title).not.toBe(title)
      expect(initial.ogTitle).toEqual([initial.title])
      expect(initial.twitterTitle).toEqual([initial.title])
      expect(JSON.stringify(initial)).not.toContain('seo-private')
      await expect(page.locator('#language')).toHaveValue(locale)
      await expect.poll(() => readMetadata(page)).toEqual(initial)
    }
  })
}

test('creating a room replaces homepage metadata and browser back restores it', async ({
  page,
}) => {
  await createRoom(page, 'SEO private room name')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex',
  )
  expect(await readMetadata(page)).toMatchObject({
    title: 'Preparar sala | Coronabingo',
    canonical: [],
    alternates: [],
    ogUrl: [],
    twitterUrl: [],
  })
  expect(JSON.stringify(await readMetadata(page))).not.toContain(
    'SEO private room name',
  )
  await page.goBack()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${origin}/`,
  )
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
  expect((await readMetadata(page)).alternates).toEqual(alternates)
})

test('discovery files list only canonical homepages and errors remain 404', async ({
  request,
  page,
}) => {
  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  expect(robots.headers()['content-type']).toContain('text/plain')
  expect(await robots.text()).toContain(`Sitemap: ${origin}/sitemap.xml`)
  expect(await robots.text()).not.toMatch(/^Disallow:\s*\S/m)

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  expect(sitemap.headers()['content-type']).toContain('xml')
  const urls = await page.evaluate(xml => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml')
    if (doc.querySelector('parsererror')) throw new Error('Invalid sitemap XML')
    return Array.from(
      doc.querySelectorAll('loc'),
      element => element.textContent,
    )
  }, await sitemap.text())
  expect(urls).toEqual([`${origin}/`, `${origin}/en`])
  for (const url of urls) {
    const response = await request.get(new URL(url!).pathname, {
      maxRedirects: 0,
    })
    expect(response.status()).toBe(200)
  }

  for (const path of ['/seo-missing-page', '/en/seo-missing-page']) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(404)
    const metadata = await readMetadata(page, await response!.text())
    expect(metadata).toMatchObject({
      canonical: [],
      alternates: [],
      robots: ['noindex'],
      description: [],
      ogUrl: [],
    })
    expect(metadata.title).toContain('404')
  }
})
