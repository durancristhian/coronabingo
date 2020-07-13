import { Player, RemoteData } from '~/interfaces'

export interface PlayersContextData {
  state: RemoteData<Error, Player[]>
  setPlayers: (array: Player[]) => void
}
