import { useContext } from 'react'
import { PlayerContext } from '~/contexts/Player'
import { REMOTE_DATA } from '~/interfaces'

export default function usePlayer() {
  const { state, updatePlayer } = useContext(PlayerContext)

  return {
    error: state.type === REMOTE_DATA.FAILURE,
    loading:
      state.type === REMOTE_DATA.NOT_ASKED ||
      state.type === REMOTE_DATA.LOADING,
    player: state.type === REMOTE_DATA.SUCCESS ? state.data : null,
    updatePlayer,
  }
}
