import { RemoteData } from '~/interfaces/custom/RemoteData'
import { Room, RoomBase } from '~/interfaces/models/Room'

export interface RoomContextData {
  state: RemoteData<Error, Room>
  updateRoom: (data: Partial<RoomBase>) => void
}
