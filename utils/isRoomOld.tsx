import { Room } from '~/interfaces'

export function isRoomOld(room: Room) {
  return !room.code
}
