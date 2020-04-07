import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useRoom from '~/hooks/useRoom'
import { roomsRef } from '~/utils/firebase'

interface IProps {
  isAdmin: boolean
}

export default function Sounds({ isAdmin }: IProps) {
  const router = useRouter()
  const roomId = router.query.id?.toString()
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
              soundToPlay: ''
            })
        })
    }
  }, [room])

  return null
}
