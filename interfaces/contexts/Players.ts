import { RemoteData } from '~/interfaces/custom/RemoteData'
import { Player } from '~/interfaces/models/Player'

export interface PlayersContextData {
  state: RemoteData<Error, Player[]>
  removePlayer: (player: Player) => Promise<void>
  setPlayers: (array: Player[]) => void
}
