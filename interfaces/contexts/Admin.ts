export interface Admin {
  loggedIn: boolean
  login: (password: string) => void
}
