export interface Stats {
  roomsByDay: {
    [key: string]: number
  }
  roomsConfigured: number
  roomsOfFamilies: number
  roomsWithOnlineBingoSpinner: number
  roomsWithVideoCall: number
  sortedRoomsByDay: {
    date: string
    value: number
  }[]
  totalRooms: number
}
