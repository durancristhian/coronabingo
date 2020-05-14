import React, { createContext, ReactNode, useState } from 'react'
import { Admin } from '~/interfaces'

const AdminContext = createContext<Admin>({
  loggedIn: false,
  login: () => void 0,
})

interface Props {
  children: ReactNode
}

const AdminContextProvider = ({ children }: Props) => {
  const [loggedIn, setLogin] = useState(false)

  const login = (roomCode: string, userCode: string) => {
    setLogin(roomCode === userCode)
  }

  return (
    <AdminContext.Provider value={{ loggedIn, login }}>
      {children}
    </AdminContext.Provider>
  )
}

export { AdminContext, AdminContextProvider }
