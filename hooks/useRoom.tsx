import { useContext } from 'react'
import { RoomContext } from '~/contexts/Room'
import { REMOTE_DATA } from '~/interfaces'

export default function useRoom() {
  const { state, updateRoom } = useContext(RoomContext)

  return {
    error: state.type === REMOTE_DATA.FAILURE,
    loading:
      state.type === REMOTE_DATA.NOT_ASKED ||
      state.type === REMOTE_DATA.LOADING,
    room: state.type === REMOTE_DATA.SUCCESS ? state.data : null,
    updateRoom,
  }
}
