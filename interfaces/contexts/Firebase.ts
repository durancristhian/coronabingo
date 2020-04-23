import { Player } from '~/interfaces'

export interface FirebaseContextData {
  players: Player[]
  setPlayers: (array: Player[]) => void
}
