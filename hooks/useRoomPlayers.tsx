import { useContext } from 'react'
import { FirebaseContext } from '~/contexts/Firebase'

export default function useRoomPlayers() {
  const { players, setPlayers } = useContext(FirebaseContext)

  return { players, setPlayers }
}
