import React, { ReactNode } from 'react'
import useAuth from '~/hooks/useAuth'
import Loading from './Loading'
import Login from './Login'
import Message from './Message'

type Props = {
  children: ReactNode
}

const EnsureLogin = ({ children }: Props) => {
  const { error, loading, notAsked, user } = useAuth()

  if (notAsked || loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Message type="error">
        Ocurrió un error al cargar la página. Intenta cargala de nuevo.
      </Message>
    )
  }

  if (!user) {
    return <Login />
  }

  return <>{children}</>
}

export default EnsureLogin
