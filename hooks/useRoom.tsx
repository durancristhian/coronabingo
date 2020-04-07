import { useEffect, useState } from 'react'
import { roomsRef } from '~/utils/firebase'

export default function useRoom(
  roomId: string
): firebase.firestore.DocumentData {
  const [room, setRoom] = useState<firebase.firestore.DocumentData>({})

  useEffect(() => {
    if (!roomId) return

    const unsubscribe = roomsRef.doc(roomId).onSnapshot(snapshot => {
      const roomData = snapshot.data()

      if (roomData) {
        setRoom(roomData)
      }
    })

    return unsubscribe
  }, [roomId])

  return room
}
