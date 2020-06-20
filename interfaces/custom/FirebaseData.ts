export interface FirebaseData extends firebase.firestore.DocumentData {
  id: string
  ref: firebase.firestore.DocumentReference
}
