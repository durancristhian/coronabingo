import { useContext } from 'react'
import { AdminContext } from '~/contexts/AdminContext'

export default function useAdminPassword() {
  const { loggedIn, login } = useContext(AdminContext)

  return { loggedIn, login }
}
