import { useContext } from 'react'
import { PlayerContext } from '~/contexts/Player'

export default function usePlayer() {
  const { player, updatePlayer } = useContext(PlayerContext)

  return { player, updatePlayer }
}
