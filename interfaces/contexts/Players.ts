import { RemoteData } from '~/interfaces/custom/RemoteData'
import { Player } from '~/interfaces/models/Player'

export interface PlayersContextData {
  state: RemoteData<Error, Player[]>
  setPlayers: (array: Player[]) => void
}
