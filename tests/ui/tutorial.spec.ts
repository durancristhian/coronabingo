import { tutorials } from '../../utils/tutorials'
import { readAnalyticsEvents } from './analytics'
import { test, expect } from './fixtures'

for (const language of ['es', 'en'] as const) {
  test(`plays the ${language} tutorial on demand and restores focus`, async ({
    page,
  }) => {
    const mediaRequests: string[] = []
    page.on('request', request => {
      if (request.url().includes('/tutorials/'))
        mediaRequests.push(request.url())
    })
    await page.goto(language === 'en' ? '/en' : '/')
    expect(mediaRequests).toEqual([])
    const open = page.getByRole('button', {
      name: language === 'en' ? 'Watch tutorial' : 'Ver tutorial',
    })
    await open.click()
    const dialog = page.getByRole('dialog')
    const video = dialog.locator('video')
    await expect(video).toHaveAttribute(
      'src',
      new RegExp(`tutorial-${language}\\.[a-f0-9]+\\.mp4$`),
    )
    await expect(video).toHaveAttribute('playsinline', '')
    await expect
      .poll(async () => video.evaluate((v: HTMLVideoElement) => v.readyState))
      .toBeGreaterThan(0)
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
    expect(
      mediaRequests.every(
        url => !url.includes(`tutorial-${language === 'en' ? 'es' : 'en'}.`),
      ),
    ).toBe(true)
    await expect
      .poll(() => readAnalyticsEvents(page))
      .toEqual([
        {
          eventName: 'tutorial_opened',
          eventParams: {
            schema_version: 'v1',
            tutorial_language: language,
            tutorial_provider: 'self_hosted',
            tutorial_version: '2026-10-v1',
            ui_language: language,
          },
        },
      ])
    await video.evaluate((v: HTMLVideoElement) => v.play())
    await expect
      .poll(async () => video.evaluate((v: HTMLVideoElement) => v.currentTime))
      .toBeGreaterThan(0.2)
    await video.evaluate((v: HTMLVideoElement) => v.pause())
    await video.evaluate((v: HTMLVideoElement) => v.play())
    await expect
      .poll(
        async () =>
          (await readAnalyticsEvents(page)).filter(
            e => e.eventName === 'tutorial_begin',
          ).length,
      )
      .toBe(1)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(page.locator('video')).toHaveCount(0)
    await expect(open).toBeFocused()
    await open.click()
    await expect(video).toHaveCount(1)
    expect(await video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(0)
    await video.evaluate((v: HTMLVideoElement) => v.play())
    await expect
      .poll(
        async () =>
          (await readAnalyticsEvents(page)).filter(
            e => e.eventName === 'tutorial_begin',
          ).length,
      )
      .toBe(2)
    await dialog.locator('#close-modal').click()
    await expect(page.locator('video')).toHaveCount(0)
  })
}

test('counts distinct playback at 80 percent, without credit for seeking or replays', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Ver tutorial' }).click()
  const video = page.locator('video')
  await expect
    .poll(async () => video.evaluate((v: HTMLVideoElement) => v.duration))
    .toBeGreaterThan(80)
  await video.evaluate(async (v: HTMLVideoElement) => {
    v.currentTime = v.duration - 1
    v.playbackRate = 8
    await v.play()
  })
  await expect
    .poll(async () => video.evaluate((v: HTMLVideoElement) => v.ended))
    .toBe(true)
  expect((await readAnalyticsEvents(page)).map(e => e.eventName)).toEqual([
    'tutorial_opened',
    'tutorial_begin',
  ])
  // Repeating a watched segment still does not count as unique coverage.
  await video.evaluate(async (v: HTMLVideoElement) => {
    v.currentTime = v.duration - 1
    await v.play()
  })
  await expect
    .poll(async () => video.evaluate((v: HTMLVideoElement) => v.ended))
    .toBe(true)
  expect((await readAnalyticsEvents(page)).map(e => e.eventName)).toEqual([
    'tutorial_opened',
    'tutorial_begin',
  ])
  await video.evaluate(async (v: HTMLVideoElement) => {
    v.currentTime = 0
    await v.play()
  })
  await expect
    .poll(
      async () =>
        (await readAnalyticsEvents(page)).filter(
          e => e.eventName === 'tutorial_engaged',
        ),
      { timeout: 20000 },
    )
    .toEqual([
      {
        eventName: 'tutorial_engaged',
        eventParams: {
          schema_version: 'v1',
          ui_language: 'es',
          tutorial_language: 'es',
          tutorial_provider: 'self_hosted',
          tutorial_version: '2026-10-v1',
          watched_percent: 80,
        },
      },
    ])
  await expect
    .poll(async () => video.evaluate((v: HTMLVideoElement) => v.ended), {
      timeout: 10000,
    })
    .toBe(true)
  expect((await readAnalyticsEvents(page)).map(e => e.eventName)).toEqual([
    'tutorial_opened',
    'tutorial_begin',
    'tutorial_engaged',
    'tutorial_complete',
  ])
})

test('offers localized fallback and a working retry after a media error', async ({
  page,
}) => {
  await page.route('**/tutorials/*.mp4', route =>
    route.fulfill({ status: 404, body: '' }),
  )
  await page.goto('/en')
  const open = page.getByRole('button', { name: 'Watch tutorial' })
  await open.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('alert')).toContainText(
    "We couldn't load the tutorial.",
  )
  await expect(
    dialog.getByRole('link', { name: 'Open video' }),
  ).toHaveAttribute('href', /tutorial-en\.[a-f0-9]+\.mp4$/)
  expect((await readAnalyticsEvents(page)).map(e => e.eventName)).toEqual([
    'tutorial_opened',
    'tutorial_error',
  ])
  await page.unroute('**/tutorials/*.mp4')
  await dialog.getByRole('button', { name: 'Try again' }).click()
  const video = dialog.locator('video')
  await video.evaluate((v: HTMLVideoElement) => v.play())
  await expect
    .poll(async () => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0)
  await dialog.locator('#close-modal').click()
  await expect(open).toBeFocused()
})

test('keeps the tutorial and its controls within a phone viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Ver tutorial' }).click()
  const video = page.locator('video')
  const box = await video.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(390)
  await expect(video).toHaveAttribute('controls', '')
  await expect(page.getByRole('dialog').locator('details')).toHaveCount(0)
})

test('serves versioned media with immutable caching and byte ranges', async ({
  request,
}) => {
  for (const tutorial of Object.values(tutorials)) {
    const video = await request.get(tutorial.src, {
      headers: { Range: 'bytes=0-1023' },
    })
    expect(video.status()).toBe(206)
    expect(video.headers()['content-type']).toBe('video/mp4')
    expect(video.headers()['content-range']).toMatch(/^bytes 0-1023\/\d+$/)
    expect(video.headers()['cache-control']).toBe(
      'public, max-age=31536000, immutable',
    )
    expect((await video.body()).length).toBe(1024)
    for (const path of [tutorial.poster, tutorial.captions]) {
      const response = await request.get(path)
      expect(response.ok()).toBe(true)
      expect(response.headers()['cache-control']).toBe(
        'public, max-age=31536000, immutable',
      )
    }
  }
})
