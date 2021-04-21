import { Room } from '~/interfaces/models/Room'

export function isRoomOld(room: Room) {
  return !room.code
}
