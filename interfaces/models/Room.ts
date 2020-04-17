export interface RoomBase {
  adminId: string
  bingoSpinner: boolean
  /* TODO: make a type of this */
  confettiType: 'confetti' | 'pallbearers' | ''
  date: firebase.firestore.Timestamp | null
  name: string
  readyToPlay: boolean
  selectedNumbers: number[]
  soundToPlay: string
  videoCall: string
}

export interface Room extends RoomBase {
  exists: boolean
  id: string
  ref: firebase.firestore.DocumentReference
}
