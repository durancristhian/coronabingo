import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useRoom from '~/hooks/useRoom'
import { roomsRef } from '~/utils/firebase'

export default function Sounds({ isAdmin }: { isAdmin?: boolean }) {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const room = useRoom(roomName)

  useEffect(() => {
    if (!room) return
    const { soundToPlay } = room

    if (soundToPlay) {
      new Audio(`/sounds/${soundToPlay}.mp3`).play().finally(() => {
        isAdmin &&
          roomsRef.doc(roomName).update({
            soundToPlay: ''
          })
      })
    }
  }, [room])

  return null
}
