import { useContext } from 'react'
import { AuthContext } from '~/contexts/Auth'
import { REMOTE_DATA } from '~/interfaces'

export default function useAuth() {
  const { state, signin, signout } = useContext(AuthContext)

  return {
    error: state.type === REMOTE_DATA.FAILURE,
    loading: state.type === REMOTE_DATA.LOADING,
    notAsked: state.type === REMOTE_DATA.NOT_ASKED,
    user: state.type === REMOTE_DATA.SUCCESS ? state.data : null,
    signin,
    signout,
  }
}
