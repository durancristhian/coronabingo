import { RemoteData, Room, RoomBase } from '~/interfaces'

export interface RoomContextData {
  state: RemoteData<Error, Room>
  updateRoom: (data: Partial<RoomBase>) => void
}
