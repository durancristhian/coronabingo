import { useContext } from 'react'
import { RoomContext } from '~/contexts/Room'

export default function useRoom() {
  const { error, loading, room, updateRoom } = useContext(RoomContext)

  return {
    error,
    loading,
    room,
    updateRoom,
  }
}
