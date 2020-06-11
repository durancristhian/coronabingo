const knuthShuffle = require('knuth-shuffle').knuthShuffle
import { Emojis } from '~/interfaces'
import { CODES } from '~/utils'

export function generateRoomCode() {
  const randomCodes: (keyof Emojis)[] = knuthShuffle(CODES.slice(0))

  return randomCodes.slice(0, 3).toString()
}
