import { RemoteData } from '~/interfaces/custom/RemoteData'
import { Player, PlayerBase } from '~/interfaces/models/Player'

export interface PlayerContextData {
  state: RemoteData<Error, Player>
  updatePlayer: (data: Partial<PlayerBase>) => void
}
