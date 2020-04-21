export interface Player {
  [key: number]: number[]
  boards: string
  exists: boolean
  id: string
  name: string
  ref: firebase.firestore.DocumentReference
}
