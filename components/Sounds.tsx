import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useRoom from '~/hooks/useRoom'
import { roomsRef } from '~/utils/firebase'

interface Props {
  isAdmin: boolean
}

export default function Sounds({ isAdmin }: Props) {
  const router = useRouter()
  const roomId = router.query.roomId?.toString()
  const room = useRoom(roomId)

  useEffect(() => {
    if (!room) return

    const { soundToPlay } = room
    if (soundToPlay) {
      new Audio(soundToPlay)
        .play()
        .catch(() => null)
        .finally(() => {
          isAdmin &&
            roomsRef.doc(roomId).update({
              soundToPlay: '',
            })
        })
    }
  }, [room])

  return null
}
