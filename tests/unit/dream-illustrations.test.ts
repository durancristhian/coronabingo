import { readdirSync } from 'node:fs'
import { expect, test } from 'vitest'

test('every number from 1 to 90 has a dream illustration', () => {
  const files = readdirSync('public/dreams').sort()
  const expected = Array.from({ length: 90 }, (_, i) => `${i + 1}.svg`).sort()

  expect(files).toEqual(expected)
})
