import React, { createContext, ReactNode } from 'react'
import { useProvideAuth } from '~/hooks/useAuth'

const defaultContextValue = {
  user: null,
  signin: () => Promise.resolve(null),
  signout: () => void 0,
  signup: () => Promise.resolve(null),
}

const AuthContext = createContext<{
  user: firebase.User | null
  signin: (email: string, password: string) => Promise<firebase.User | null>
  signout: () => void
  signup: (email: string, password: string) => Promise<firebase.User | null>
}>(defaultContextValue)

interface Props {
  children: ReactNode
}

const ProvideAuth = ({ children }: Props) => {
  const auth = useProvideAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export { AuthContext, ProvideAuth }
