import { useContext } from 'react'
import { PlayerContext } from '~/contexts/Player'

export default function usePlayer() {
  const { state, updatePlayer } = useContext(PlayerContext)

  return {
    error: state.type === 'FAILURE',
    loading: state.type === 'NOT_ASKED' || state.type === 'LOADING',
    player: state.type === 'SUCCESS' ? state.data : null,
    updatePlayer,
  }
}
