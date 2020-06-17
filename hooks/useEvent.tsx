import { useContext } from 'react'
import { EventContext } from '~/contexts/Event'

export default function useEvent() {
  const { error, loading, event } = useContext(EventContext)

  return {
    error,
    loading,
    event,
  }
}
