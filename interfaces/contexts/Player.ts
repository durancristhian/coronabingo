import { RemoteData } from '~/interfaces/custom/RemoteData'
import { Player } from '~/interfaces/models/Player'

export interface PlayerContextData {
  state: RemoteData<Error, Player | null>
}
