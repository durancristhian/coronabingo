import { Player, PlayerBase, RemoteData } from '~/interfaces'

export interface PlayerContextData {
  state: RemoteData<Error, Player>
  updatePlayer: (data: Partial<PlayerBase>) => void
}
