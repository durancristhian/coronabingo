import { useContext } from 'react'
import { FirebaseContext } from '~/contexts/Firebase'

export default function usePlayer() {
  const { currentPlayer, setCurrentPlayer } = useContext(FirebaseContext)

  return { player: currentPlayer, setPlayer: setCurrentPlayer }
}
