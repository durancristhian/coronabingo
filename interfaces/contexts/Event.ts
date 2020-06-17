import { Event } from '~/interfaces'

export interface EventContextData {
  error: string
  loading: boolean
  event?: Event
}
