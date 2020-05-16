import { useContext } from 'react'
import { RoomContext } from '~/contexts/Room'

export default function useRoom() {
  const { room, updateRoom } = useContext(RoomContext)

  return { room, updateRoom }
}
