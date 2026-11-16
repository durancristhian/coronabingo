import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '~': fileURLToPath(new URL('.', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    // Reuses jsdom per worker while keeping per-file module isolation.
    // `isolate: false` was faster but let module state leak between files.
    pool: 'vmThreads',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/unit/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
  },
})
