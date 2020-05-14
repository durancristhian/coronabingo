export interface Admin {
  loggedIn: boolean
  login: (roomCode: string, userCode: string) => void
}
