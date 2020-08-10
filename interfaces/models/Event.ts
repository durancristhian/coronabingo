export interface EventBase {
  content: {
    html: string
    text: string
  }
  date: firebase.firestore.Timestamp
  name: string
  roomId: string
  userId: string
}

export interface Event extends EventBase {
  id: string
  ref: firebase.firestore.DocumentReference
}
