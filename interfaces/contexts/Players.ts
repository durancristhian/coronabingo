import { Player } from '~/interfaces'

export interface PlayersContextData {
  error: string
  loading: boolean
  players: Player[]
  setPlayers: (array: Player[]) => void
}
