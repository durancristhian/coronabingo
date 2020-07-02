import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '~/contexts/Auth'
import { auth } from '~/utils'

const useAuth = () => {
  return useContext(AuthContext)
}

export const useProvideAuth = () => {
  /* TODO: improve this */
  const [user, setUser] = useState<firebase.User | null | 'not asked'>(
    'not asked',
  )

  const signin = (email: string, password: string) => {
    return auth.signInWithEmailAndPassword(email, password).then(response => {
      setUser(response.user)

      return response.user
    })
  }

  const signout = () => {
    return auth.signOut().then(() => {
      setUser(null)
    })
  }

  const signup = (email: string, password: string) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user)

        return response.user
      })
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  return {
    user,
    signin,
    signup,
    signout,
  }
}

export default useAuth
