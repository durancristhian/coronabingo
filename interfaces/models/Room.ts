import { ConfettiType } from '~/interfaces'

export type RoomStatus = 'initialized' | 'playing'

export interface RoomBase {
  adminId: string
  bingoSpinner: boolean
  code: string
  confettiType: ConfettiType
  date: firebase.firestore.Timestamp | null
  hideNumbersMeaning: boolean
  name: string
  selectedNumbers: number[]
  soundToPlay: string
  status: RoomStatus
  timesPlayed: number
}

export interface Room extends RoomBase {
  exists: boolean
  id: string
  ref: firebase.firestore.DocumentReference
}
