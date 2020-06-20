import { ConfettiType } from '~/interfaces'

export interface RoomBase {
  activateAdminCode: boolean
  adminId: string
  bingoSpinner: boolean
  code: string
  confettiType: ConfettiType
  date: firebase.firestore.Timestamp | null
  hideNumbersMeaning: boolean
  locked: boolean
  name: string
  readyToPlay: boolean
  selectedNumbers: number[]
  soundToPlay: string
  timesPlayed: number
}

export interface Room extends RoomBase {
  id: string
  ref: firebase.firestore.DocumentReference
}
