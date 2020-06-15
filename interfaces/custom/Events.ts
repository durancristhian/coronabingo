import { Player } from '~/interfaces'

export interface Event {
  endpoints: {
    email: string
  }
  formURL: string
  roomId: string
  spreadsheetId: string
  worksheetTitle: string
}

export interface EventTicket {
  id: string
  tickets: string
}

export interface Events {
  [key: string]: Event
}

export interface Registration {
  comment: string
  email: string
  name: string
  paymentURL: string
  paymentImage: string
  player: Player | undefined
  tel: string
  timestamp: Date
}
