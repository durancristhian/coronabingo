import { useEffect } from 'react'

interface Props {
  onAudioEnd: () => void
  soundToPlay: string
}

export default function Sounds({ onAudioEnd, soundToPlay }: Props) {
  useEffect(() => {
    if (!soundToPlay) return
    const audio = new Audio(soundToPlay)
    audio.volume = 0.3
    audio
      .play()
      .catch(() => null)
      .finally(
        () =>
          setTimeout(() => {
            onAudioEnd()
            audio.remove()
          }, audio.duration * 1000), // ms
      )
  }, [soundToPlay])

  return null
}
