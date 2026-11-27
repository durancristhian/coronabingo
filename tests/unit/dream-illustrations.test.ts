import { expect, test } from 'vitest'
import dreamIllustrations from '~/utils/dreamIllustrations'

test('every number from 1 to 90 has a dream illustration', () => {
  const numbers = Object.keys(dreamIllustrations).map(Number)
  const expected = Array.from({ length: 90 }, (_, i) => i + 1)

  expect(numbers).toEqual(expected)
})
