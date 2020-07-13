import { useContext } from 'react'
import { PlayersContext } from '~/contexts/Players'

export default function usePlayers() {
  const { state, setPlayers } = useContext(PlayersContext)

  return {
    error: state.type === 'FAILURE',
    loading: state.type === 'NOT_ASKED' || state.type === 'LOADING',
    players: state.type === 'SUCCESS' ? state.data : [],
    setPlayers,
  }
}
