import { useContext } from 'react'
import { RoomCodeContext } from '~/contexts/RoomCode'
import useRoom from '~/hooks/useRoom'

export default function useRoomCode() {
  const { grant, grantAccess, revokeAccess } = useContext(RoomCodeContext)
  const { room } = useRoom()

  const login = () => {
    if (room?.readyToPlay) {
      grantAccess({ roomId: room.id, playNumber: room.timesPlayed })
    }
  }

  return {
    loggedIn:
      !!room?.readyToPlay &&
      grant?.roomId === room.id &&
      grant.playNumber === room.timesPlayed,
    login,
    logout: revokeAccess,
  }
}
