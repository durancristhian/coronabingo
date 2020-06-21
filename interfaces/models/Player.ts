export interface PlayerBase {
  [key: number]: number[]
  tickets: string
  date: firebase.firestore.Timestamp
  name: string
  selectedNumbers: number[]
}

export interface Player extends PlayerBase {
  id: string
  ref: firebase.firestore.DocumentReference
}
