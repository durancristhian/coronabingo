import { knuthShuffle } from 'knuth-shuffle'
import { Emojis } from '~/interfaces/custom/Emojis'
import { CODES, ROOM_CODE_LENGTH } from '~/utils/roomCodes'

export function generateRoomCode() {
  const randomCodes: (keyof Emojis)[] = knuthShuffle(CODES.slice(0))

  return randomCodes.slice(0, ROOM_CODE_LENGTH).toString()
}
