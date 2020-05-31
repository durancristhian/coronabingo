import { useContext } from 'react'
import { PlayerContext } from '~/contexts/Player'

export default function usePlayer() {
  const { error, loading, player, updatePlayer } = useContext(PlayerContext)

  return { error, loading, player, updatePlayer }
}
