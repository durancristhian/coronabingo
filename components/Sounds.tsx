import { useEffect } from 'react'
import { Room } from '~/interfaces'
import roomApi from '~/models/room'

interface Props {
  isAdmin: boolean
  room: Room
}

export default function Sounds({ isAdmin, room }: Props) {
  useEffect(() => {
    if (!room.soundToPlay) return

    const audio = new Audio(room.soundToPlay)
    audio.volume = 0.3
    audio
      .play()
      .catch(() => null)
      .finally(() => {
        setTimeout(() => {
          audio.remove()

          isAdmin && roomApi.updateRoom(room.ref, { soundToPlay: '' })
        }, audio.duration * 1000)
      })
  }, [room.soundToPlay])

  return null
}
