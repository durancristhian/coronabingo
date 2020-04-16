export interface Room {
  adminId: string
  bingoSpinner: boolean
  /* TODO: make a type of this */
  confettiType: 'confetti' | 'pallbearers'
  date: firebase.firestore.Timestamp
  exists: boolean
  id: string
  name: string
  readyToPlay: boolean
  ref: firebase.firestore.DocumentReference
  selectedNumbers: number[]
  soundToPlay: string
  videoCall: string
}
