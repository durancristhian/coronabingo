import { useContext } from 'react'
import { PlayersContext } from '~/contexts/Players'

export default function useRoomPlayers() {
  const { players, setPlayers } = useContext(PlayersContext)

  return { players, setPlayers }
}
