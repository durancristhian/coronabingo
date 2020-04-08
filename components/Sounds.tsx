import { useEffect } from 'react'

interface Props {
  onAudioEnd: () => void
  soundToPlay: string
}

export default function Sounds({ onAudioEnd, soundToPlay }: Props) {
  useEffect(() => {
    if (!soundToPlay) return
    new Audio(soundToPlay)
      .play()
      .catch(() => null)
      .finally(onAudioEnd)
  }, [soundToPlay])

  return null
}
