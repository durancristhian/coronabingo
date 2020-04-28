import { useContext } from 'react'
import { PlayersContext } from '~/contexts/PlayersContext'

export default function useRoomPlayers() {
  const { players, setPlayers } = useContext(PlayersContext)

  return { players, setPlayers }
}
