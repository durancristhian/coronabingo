import { Player } from '~/interfaces'

export interface EventBase {
  date: firebase.firestore.Timestamp
  roomId: string
  eventName: string
  content: {
    html: string
    text: string
  }
  emailEndpoint: string
  formURL: string
  spreadsheetId: string
  worksheetTitle: string
  userId: string
}

export interface Event extends EventBase {
  exists: boolean
  id: string
  ref: firebase.firestore.DocumentReference
}

export interface EventTicket {
  id: string
  tickets: string
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
