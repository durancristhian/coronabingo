import { useEffect } from 'react'

interface Props {
  onAudioEnd: () => void
  onAudioPlayed: () => void
  soundToPlay: string
}

export default function Sounds({
  onAudioEnd,
  onAudioPlayed,
  soundToPlay,
}: Props) {
  useEffect(() => {
    if (!soundToPlay) return
    const audio = new Audio(soundToPlay)
    audio.volume = 0.3
    audio
      .play()
      .catch(() => null)
      .finally(() => {
        onAudioPlayed()
        setTimeout(() => {
          onAudioEnd()
          audio.remove()
        }, audio.duration * 1000)
      })
  }, [soundToPlay])

  return null
}
