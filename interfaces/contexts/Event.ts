import { Event, RemoteData } from '~/interfaces'

export interface EventContextData {
  state: RemoteData<Error, Event>
}
