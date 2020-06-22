export interface RoomTicketBase {
  tickets: string
}

export interface RoomTicket extends RoomTicketBase {
  id: string
  ref: firebase.firestore.DocumentReference
}
