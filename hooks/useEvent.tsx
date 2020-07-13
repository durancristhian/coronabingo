import { useContext } from 'react'
import { EventContext } from '~/contexts/Event'

export default function useEvent() {
  const { state } = useContext(EventContext)

  return {
    error: state.type === 'FAILURE',
    loading: state.type === 'NOT_ASKED' || state.type === 'LOADING',
    event: state.type === 'SUCCESS' ? state.data : null,
  }
}
