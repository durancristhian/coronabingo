import { Player, PlayerBase } from '~/interfaces'

export interface PlayerContextData {
  error: string
  loading: boolean
  player?: Player
  updatePlayer: (data: Partial<PlayerBase>) => void
}
