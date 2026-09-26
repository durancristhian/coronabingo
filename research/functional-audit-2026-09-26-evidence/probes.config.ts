import { defineConfig } from '@playwright/test'
import base from '../../playwright.config'

export default defineConfig({
  ...base,
  testDir: __dirname,
  testMatch: 'high-priority.spec.ts',
  outputDir: './results',
  reporter: [['list'], ['json', { outputFile: './results.json' }]],
  use: { ...base.use, trace: 'off', screenshot: 'only-on-failure' },
})
