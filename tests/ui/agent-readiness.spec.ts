import { test, expect } from './fixtures'

const paths = [
  '/',
  '/en',
  ...['', '/en'].flatMap(prefix =>
    ['about', 'contact', 'privacy'].map(path => `${prefix}/${path}`),
  ),
]

for (const path of paths) {
  test(`${path} negotiates Markdown and HTML without changing URLs`, async ({
    request,
    page,
  }, testInfo) => {
    const md = await request.get(path, {
      headers: { Accept: 'text/markdown' },
      maxRedirects: 0,
    })
    expect(md.status()).toBe(200)
    expect(md.headers()['content-type']).toContain('text/markdown')
    expect(
      md
        .headers()
        .vary.toLowerCase()
        .split(/,\s*/),
    ).toContain('accept')
    expect(md.headers()['cache-control']).toContain('no-store')
    const text = await md.text()
    expect(text).toMatch(/^# /)
    expect(text.length).toBeGreaterThan(500)
    expect(text).not.toContain('<!DOCTYPE')
    const html = await request.get(path, {
      headers: { Accept: 'text/html' },
      maxRedirects: 0,
    })
    expect(html.status()).toBe(200)
    expect(html.headers()['content-type']).toContain('text/html')
    expect(
      html
        .headers()
        .vary.toLowerCase()
        .split(/,\s*/),
    ).toContain('accept')
    expect(html.headers()['cache-control']).toContain('no-store')
    const source = await html.text()
    if (path === '/' || path === '/en') {
      const schemaText = await page.evaluate(
        html =>
          new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector('script[type="application/ld+json"]')?.textContent,
        source,
      )
      expect(schemaText).toBeTruthy()
      const schema = JSON.parse(schemaText!)
      expect(schema).toMatchObject({
        '@type': 'SoftwareApplication',
        name: 'Coronabingo',
        url: `https://coronabingo.com.ar${path}`,
        offers: { price: '0' },
        creator: {
          '@type': 'Person',
          name: 'Cristhian Duran',
          email: 'durancristhiandev@gmail.com',
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'support',
            email: 'durancristhiandev@gmail.com',
          },
        },
      })
      expect(schema.creator).not.toHaveProperty('address')
      expect(schema.creator).not.toHaveProperty('telephone')
      expect(schema.description.length).toBeGreaterThan(20)
      expect(schema.keywords).toContain(
        path === '/en' ? 'online bingo' : 'bingo online',
      )
    }
    await page.goto(path)
    if (path === '/' || path === '/en') {
      await expect(
        page.locator('script[type="application/ld+json"]'),
      ).toHaveCount(1)
    }
    if (path !== '/' && path !== '/en') {
      await expect(
        page.locator('article a[href="mailto:durancristhiandev@gmail.com"]'),
      ).toHaveText(/durancristhiandev@gmail.com/)
      expect(text).toContain('(mailto:durancristhiandev@gmail.com)')
      const paragraphs = await page.evaluate(
        html =>
          [
            ...new DOMParser()
              .parseFromString(html, 'text/html')
              .querySelectorAll('article p'),
          ].map(p => p.textContent || ''),
        source,
      )
      expect(paragraphs.join(' ').length).toBeGreaterThan(500)
      for (const paragraph of paragraphs) expect(text).toContain(paragraph)
      expect(
        (await page.locator('article').innerText()).length,
      ).toBeGreaterThan(500)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://coronabingo.com.ar${path}`,
      )
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
    }
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 800 })
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true)
      if (path === '/' || path === '/privacy')
        await page.screenshot({
          path: testInfo.outputPath(`public-${width}.png`),
          fullPage: true,
        })
    }
    const head = await request.head(path, {
      headers: { Accept: 'text/markdown' },
    })
    expect(head.status()).toBe(200)
    expect(await head.text()).toBe('')
  })
}

test('missing pages preserve 404 status with negotiated bodies', async ({
  request,
}) => {
  for (const path of [
    '/__agent-missing',
    '/en/__agent-missing',
    '/missing/deep/page.html',
  ]) {
    for (const type of ['text/markdown', 'text/html']) {
      const response = await request.get(path, { headers: { Accept: type } })
      expect(response.status()).toBe(404)
      expect(response.headers()['content-type']).toContain(type)
      expect(response.headers().vary.toLowerCase()).toContain('accept')
      const body = await response.text()
      expect(body.length).toBeGreaterThan(20)
      if (type === 'text/markdown') {
        expect(body).toMatch(/\[[^\]]*Coronabingo/)
        expect(body).toContain('https://coronabingo.com.ar/llms.txt')
      }
    }
  }
  const head = await request.head('/__agent-missing', {
    headers: { Accept: 'text/markdown' },
  })
  expect(head.status()).toBe(404)
  expect(head.headers()['content-type']).toContain('text/markdown')
  expect(await head.text()).toBe('')
})

test('locale aliases negotiate and static assets keep their media types', async ({
  request,
}) => {
  for (const path of ['/es', '/es/', '/en/']) {
    const response = await request.get(path, {
      headers: { Accept: 'text/markdown' },
    })
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/markdown')
    expect(await response.text()).toContain(
      path.startsWith('/es')
        ? 'Bingo online con amigos'
        : 'Online bingo with friends',
    )
  }
  const asset = await request.get('/favicon.ico', {
    headers: { Accept: 'text/markdown' },
  })
  expect(asset.status()).toBe(200)
  expect(asset.headers()['content-type']).not.toContain('text/markdown')
})

test('public endpoints respect Accept preferences and reject unsupported formats', async ({
  request,
}) => {
  for (const [accept, status, type] of [
    ['text/markdown;q=0, text/html', 200, 'text/html'],
    ['text/markdown;q=0.8, text/html;q=0.5', 200, 'text/markdown'],
    ['application/json', 406, 'text/plain'],
    ['text/html;q=0, text/markdown;q=0', 406, 'text/plain'],
    ['*/*', 200, 'text/html'],
  ] as const) {
    const response = await request.get('/', { headers: { Accept: accept } })
    expect(response.status()).toBe(status)
    expect(response.headers()['content-type']).toContain(type)
  }
})

test('llms.txt follows the published structure and all discovery links resolve', async ({
  request,
}) => {
  const response = await request.get('/llms.txt')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/plain')
  const body = await response.text()
  expect(body).toMatch(/^# Coronabingo\n\n> /)
  expect(body).toContain('When to use this:')
  expect(body).toContain('## When to use this')
  expect(body).toContain('How to use:')
  expect(body).toContain('no documented public API')
  for (const section of body.split(/^## /m).slice(1)) {
    expect(
      section
        .trim()
        .split('\n')
        .slice(1)
        .filter(Boolean)
        .every(line => /^- \[.+\]\(https:\/\/.+\)/.test(line)),
    ).toBe(true)
  }
  const urls = [
    ...body.matchAll(/\]\((https:\/\/coronabingo.com.ar[^)]+)\)/g),
  ].map(match => match[1])
  for (const url of urls)
    expect((await request.get(new URL(url).pathname)).status()).toBe(200)
})
