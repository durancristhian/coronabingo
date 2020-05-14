import { ConfettiType } from '~/interfaces'

export interface RoomBase {
  adminId: string
  bingoSpinner: boolean
  code: string
  confettiType: ConfettiType
  date: firebase.firestore.Timestamp | null
  name: string
  readyToPlay: boolean
  selectedNumbers: number[]
  soundToPlay: string
}

export interface Room extends RoomBase {
  exists: boolean
  id: string
  ref: firebase.firestore.DocumentReference
}
