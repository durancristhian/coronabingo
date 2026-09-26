import { Page } from '@playwright/test'
import { test, expect } from './fixtures'

interface YouTubeMockOptions {
  requests?: string[]
}

async function mockYouTubePlayer(
  page: Page,
  { requests = [] }: YouTubeMockOptions = {},
) {
  await page.route('**://www.youtube.com/iframe_api', route => {
    requests.push(route.request().url())
    return route.fulfill({
      contentType: 'application/javascript',
      body: `
        window.YT = {
          PlayerState: { CUED: 5 },
          Player: function(element, options) {
            var iframe = document.createElement('iframe');
            iframe.className = element.className;
            iframe.src = 'https://www.youtube.com/embed/' + options.videoId;
            element.replaceWith(iframe);
            this.destroy = function() { iframe.remove(); };
            this.getIframe = function() { return iframe; };
            this.getPlayerState = function() { return 5; };
            setTimeout(function() {
              options.events.onReady({ target: this });
            }.bind(this), 0);
          }
        };
        setTimeout(function() { window.onYouTubeIframeAPIReady(); }, 0);
      `,
    })
  })
  await page.route('https://www.youtube.com/embed/**', route => {
    requests.push(route.request().url())
    return route.fulfill({
      contentType: 'text/html',
      body: `
        <main>
          <p role="status">Tutorial video ready</p>
          <button type="button" onclick="document.querySelector('[role=status]').textContent = 'Tutorial video playing'">
            Play tutorial
          </button>
        </main>
      `,
    })
  })
}

test('loads the tutorial player only after the visitor opens it', async ({
  page,
}) => {
  const playerScripts: string[] = []
  const youtubeRequests: string[] = []

  await mockYouTubePlayer(page, { requests: youtubeRequests })
  await page.route('**/_next/static/chunks/**', async route => {
    const response = await route.fetch()
    const body = await response.text()
    if (body.includes('youtube.com/iframe_api')) {
      playerScripts.push(response.url())
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    await route.fulfill({ response, body })
  })

  await page.goto('/')
  expect(playerScripts).toEqual([])
  expect(youtubeRequests).toEqual([])

  await page.getByRole('button', { name: 'Ver tutorial' }).click()
  await expect(page.getByRole('status')).toContainText('Cargando tutorial...')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect.poll(() => playerScripts).toHaveLength(1)
  await expect
    .poll(
      () => youtubeRequests.filter(url => url.endsWith('/iframe_api')).length,
    )
    .toBe(1)
  await expect
    .poll(
      () =>
        youtubeRequests.filter(url => url.includes('/embed/XJpKBegq5GY'))
          .length,
    )
    .toBe(1)
})

test('opens, closes and reopens one working tutorial player', async ({
  page,
}) => {
  await mockYouTubePlayer(page)
  await page.goto('/')
  const openTutorial = page.getByRole('button', { name: 'Ver tutorial' })

  await openTutorial.click()
  const dialog = page.getByRole('dialog', {
    name: 'Tutorial - Como jugar Coronabingo',
  })
  const player = dialog.locator('iframe.video-iframe')
  await expect(player).toHaveCount(1)
  await expect(player).toHaveAttribute(
    'src',
    'https://www.youtube.com/embed/XJpKBegq5GY',
  )
  await expect(
    dialog
      .frameLocator('iframe.video-iframe')
      .getByText('Tutorial video ready'),
  ).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page.locator('iframe.video-iframe')).toHaveCount(0)
  await expect(openTutorial).toBeFocused()

  await openTutorial.click()
  await expect(dialog.locator('iframe.video-iframe')).toHaveCount(1)
  const playerFrame = dialog.frameLocator('iframe.video-iframe')
  await playerFrame.getByRole('button', { name: 'Play tutorial' }).click()
  await expect(playerFrame.getByRole('status')).toHaveText(
    'Tutorial video playing',
  )
  await dialog.locator('#close-modal').click()
  await expect(dialog).toBeHidden()
  await expect(page.locator('iframe.video-iframe')).toHaveCount(0)
})

test('offers a usable fallback and restores focus when YouTube fails', async ({
  page,
}) => {
  await page.goto('/')
  const openTutorial = page.getByRole('button', { name: 'Ver tutorial' })

  await openTutorial.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('alert')).toContainText(
    'No pudimos cargar el tutorial.',
  )
  await expect(
    dialog.getByRole('link', { name: 'Abrir en YouTube' }),
  ).toHaveAttribute('href', 'https://www.youtube.com/watch?v=XJpKBegq5GY')

  await dialog.locator('#close-modal').click()
  await expect(dialog).toBeHidden()
  await expect(openTutorial).toBeFocused()

  await openTutorial.click()
  await expect(dialog.getByRole('alert')).toBeVisible()
  await expect(dialog.locator('.video-wrapper')).toHaveCount(0)
})

test('loads the English tutorial on the English homepage', async ({ page }) => {
  await mockYouTubePlayer(page)
  await page.goto('/en')
  await page.getByRole('button', { name: 'Watch tutorial' }).click()

  const dialog = page.getByRole('dialog', {
    name: 'Tutorial - How to play Coronabingo',
  })
  const player = dialog.locator('iframe.video-iframe')
  await expect(player).toHaveCount(1)
  await expect(player).toHaveAttribute(
    'src',
    'https://www.youtube.com/embed/iP0732WuS5E',
  )
  await expect(
    dialog
      .frameLocator('iframe.video-iframe')
      .getByText('Tutorial video ready'),
  ).toBeVisible()
})
