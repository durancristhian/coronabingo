import { vi } from 'vitest'

export const database = {
  doc: vi.fn(),
  runTransaction: vi.fn(),
  createBatch: vi.fn(),
}
