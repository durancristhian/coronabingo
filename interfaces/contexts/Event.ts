import { RemoteData } from '~/interfaces/custom/RemoteData'
import { Event } from '~/interfaces/models/Event'

export interface EventContextData {
  state: RemoteData<Error, Event>
}
