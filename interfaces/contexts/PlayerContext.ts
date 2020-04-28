import { Player, PlayerBase } from '~/interfaces'

export interface PlayerContextData {
  player?: Player
  updatePlayer: (data: Partial<PlayerBase>) => void
}
