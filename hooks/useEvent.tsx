import { useContext } from 'react'
import { EventContext } from '~/contexts/Event'
import { REMOTE_DATA } from '~/interfaces'

export default function useEvent() {
  const { state } = useContext(EventContext)

  return {
    error: state.type === REMOTE_DATA.FAILURE,
    loading:
      state.type === REMOTE_DATA.NOT_ASKED ||
      state.type === REMOTE_DATA.LOADING,
    event: state.type === REMOTE_DATA.SUCCESS ? state.data : null,
  }
}
