const knuthShuffle = require('knuth-shuffle').knuthShuffle
import { Emojis } from '~/interfaces/custom/Emojis'
import { CODES } from '~/utils/constants'

export function generateRoomCode() {
  const randomCodes: (keyof Emojis)[] = knuthShuffle(CODES.slice(0))

  return randomCodes.slice(0, 3).toString()
}
