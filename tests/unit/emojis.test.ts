import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'vitest'
import emojiLabels from '../../utils/emojiLabels.json'

test('every labeled emoji has a self-hosted graphic', () => {
  const missing = Object.keys(emojiLabels).filter(
    name => !existsSync(join(__dirname, '../../public/emojis', `${name}.svg`)),
  )

  expect(missing).toEqual([])
})
