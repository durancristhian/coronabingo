import { Player } from '~/interfaces'

export interface FirebaseContextData {
  currentPlayer?: Player
  players: Player[]
  setCurrentPlayer: (array: Player) => void
  setPlayers: (array: Player[]) => void
}
