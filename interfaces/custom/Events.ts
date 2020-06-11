import { Player } from '~/interfaces'

export interface Event {
  endpoints: {
    email: string
  }
  roomId: string
  spreadsheetId: string
  spreadsheetURL: string
  worksheetTitle: string
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
