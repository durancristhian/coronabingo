import { defineConfig, devices } from '@playwright/test'
import { baseURL } from './tests/ui/environment'

if (process.env.UI_TEST_RUNNER !== '1') {
  throw new Error('Use npm run ui-tests to prepare and isolate the services.')
}

export default defineConfig({
  testDir: './tests/ui',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  timeout: 90_000,
  expect: { timeout: 15_000 },
  outputDir: 'test-results',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    locale: 'es-AR',
    actionTimeout: 15_000,
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium' }],
})
