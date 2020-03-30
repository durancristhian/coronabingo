import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSound from 'use-sound'
import useRoom from '~/hooks/useRoom'
// @ts-ignore
import miraEseBolilleroPapa from '~/public/sounds/mira-ese-bolillero-papa.mp3'

export default function Sounds() {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const room = useRoom(roomName)
  const [play, { stop }] = useSound(miraEseBolilleroPapa)

  useEffect(() => {
    if (!room) return

    const { miraEseBolilleroPapa } = room

    if (miraEseBolilleroPapa) {
      stop()
      play({})
    }
  }, [room])

  return null
}
