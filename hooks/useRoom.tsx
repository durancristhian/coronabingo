import { useContext } from 'react'
import { FirebaseContext } from '~/contexts/Firebase'

export default function useRoom(): [firebase.firestore.DocumentData, Function] {
  const { room = {}, changeRoom } = useContext(FirebaseContext)
  return [room, changeRoom]
}
