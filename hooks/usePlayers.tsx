import { useContext } from 'react'
import { PlayersContext } from '~/contexts/Players'
import { REMOTE_DATA } from '~/interfaces'

export default function usePlayers() {
  const { state, setPlayers } = useContext(PlayersContext)

  return {
    error: state.type === REMOTE_DATA.FAILURE,
    loading:
      state.type === REMOTE_DATA.NOT_ASKED ||
      state.type === REMOTE_DATA.LOADING,
    players: state.type === REMOTE_DATA.SUCCESS ? state.data : [],
    setPlayers,
  }
}
