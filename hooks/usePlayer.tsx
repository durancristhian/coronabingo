import { useContext } from 'react'
import { PlayerContext } from '~/contexts/PlayerContext'

export default function useRoom() {
  const { player, updatePlayer } = useContext(PlayerContext)

  return { player, updatePlayer }
}
