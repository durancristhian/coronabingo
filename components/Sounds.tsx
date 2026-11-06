import { useEffect } from 'react'
import { captureException } from '@sentry/browser'
import { Room } from '~/interfaces/models/Room'
import roomApi from '~/models/room'

interface Props {
  isAdmin: boolean
  room: Room
}

export default function Sounds({ isAdmin, room }: Props) {
  useEffect(() => {
    if (!room.soundToPlay) return

    let active = true
    const audio = new Audio(room.soundToPlay)
    audio.volume = 0.3
    let completed = false
    const clear = () => {
      if (active && isAdmin) {
        void roomApi.clearSound(room).catch(captureException)
      }
    }
    const finish = () => {
      completed = true
      clear()
    }
    const retryCompleted = () => {
      if (completed) clear()
    }
    window.addEventListener('online', retryCompleted)
    audio.onended = finish
    audio.onerror = finish
    void audio.play().catch(finish)

    return () => {
      active = false
      window.removeEventListener('online', retryCompleted)
      audio.onended = null
      audio.onerror = null
      audio.pause()
      audio.remove()
    }
  }, [
    room.id,
    room.timesPlayed,
    room.soundToPlay,
    room.soundCommandId,
    isAdmin,
  ])

  return null
}
