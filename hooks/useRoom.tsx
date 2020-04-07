import { useContext } from 'react'
import { FirebaseContext } from '~/contexts/Firebase'

export default function useRoom(): firebase.firestore.DocumentData {
  const { room = {} } = useContext(FirebaseContext)
  return room
}
