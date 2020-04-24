import { Player } from '~/interfaces'

export interface PlayersContextData {
  players: Player[]
  setPlayers: (array: Player[]) => void
}
