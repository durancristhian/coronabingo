import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { AuthContextData, RemoteData, REMOTE_DATA } from '~/interfaces'
import { auth } from '~/utils'

const AuthContext = createContext<AuthContextData>({
  state: {
    type: REMOTE_DATA.NOT_ASKED,
  },
  signin: () => Promise.resolve(null),
  signout: () => void 0,
})

interface Props {
  children: ReactNode
}

const ProvideAuth = ({ children }: Props) => {
  const [state, setState] = useState<RemoteData<Error, firebase.User | null>>({
    type: REMOTE_DATA.NOT_ASKED,
  })

  const signin = (email: string, password: string) => {
    return auth.signInWithEmailAndPassword(email, password).then(response => {
      if (!response.user) {
        setState({
          type: REMOTE_DATA.FAILURE,
          error: new Error('User does not exist'),
        })

        return null
      }

      setState({
        type: REMOTE_DATA.SUCCESS,
        data: response.user,
      })

      return response.user
    })
  }

  const signout = () => {
    auth.signOut().then(() => {
      setState({
        type: REMOTE_DATA.NOT_ASKED,
      })
    })
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setState({
        type: REMOTE_DATA.SUCCESS,
        data: user,
      })
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        state,
        signin,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, ProvideAuth }
