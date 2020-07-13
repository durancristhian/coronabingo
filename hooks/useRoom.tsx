import { useContext } from 'react'
import { RoomContext } from '~/contexts/Room'

export default function useRoom() {
  const { state, updateRoom } = useContext(RoomContext)

  return {
    error: state.type === 'FAILURE',
    loading: state.type === 'NOT_ASKED' || state.type === 'LOADING',
    room: state.type === 'SUCCESS' ? state.data : null,
    updateRoom,
  }
}
