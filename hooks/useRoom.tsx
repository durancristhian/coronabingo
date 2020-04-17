import { useContext } from 'react'
import { RoomContext } from '~/contexts/RoomContext'

export default function useRoom() {
  const { room, updateRoom } = useContext(RoomContext)

  return { room, updateRoom }
}
