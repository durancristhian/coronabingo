import { useEffect } from 'react'

interface IProps {
  onAudioEnd: () => void
  soundToPlay: string
}

export default function Sounds({ onAudioEnd, soundToPlay }: IProps) {
  useEffect(() => {
    if (!soundToPlay) return
    new Audio(soundToPlay)
      .play()
      .catch(() => null)
      .finally(onAudioEnd)
  }, [soundToPlay])

  return null
}
