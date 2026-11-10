import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

import { database } from './database'

document.body.innerHTML = '<div id="__next"></div>'

beforeEach(() => {
  database.doc.mockReset().mockImplementation(() => {
    throw new Error('Supply a controlled Firestore boundary in this test')
  })
  database.runTransaction.mockReset()
  database.createBatch.mockReset()
})

vi.mock('next/router', async importOriginal => {
  const actual = await importOriginal<typeof import('next/router')>()
  return { ...actual, default: { locale: 'en', push: vi.fn() } }
})

// Isolated tests must explicitly supply their database boundary.
vi.mock('~/utils/firebase', async () => {
  const { database } = await import('./database')
  return {
    roomsRef: { doc: database.doc },
    runTransaction: database.runTransaction,
    createBatch: database.createBatch,
    Timestamp: {
      now: () => ({ toDate: () => new Date('2026-11-06T00:00:00Z') }),
      fromDate: (date: Date) => ({ toDate: () => date }),
    },
  }
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
