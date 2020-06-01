import { Room, RoomBase } from '~/interfaces'

export interface RoomContextData {
  error: string
  loading: boolean
  room?: Room
  updateRoom: (data: Partial<RoomBase>) => void
}
