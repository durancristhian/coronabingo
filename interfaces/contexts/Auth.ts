import { RemoteData } from '~/interfaces'

export interface AuthContextData {
  state: RemoteData<Error, firebase.User | null>
  signin: (email: string, password: string) => Promise<firebase.User | null>
  signout: () => void
}
