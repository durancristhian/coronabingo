import { Room, RoomBase } from '~/interfaces'

export interface RoomContextData {
  room?: Room
  updateRoom: (data: Partial<RoomBase>) => void
}
