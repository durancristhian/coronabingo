import { useEffect, useState } from 'react'
import { roomsRef } from '~/utils/firebase'

export default function useRoom(
  roomName: string
): firebase.firestore.DocumentData {
  const [room, setRoom] = useState<firebase.firestore.DocumentData>({})

  useEffect(() => {
    if (!roomName) return

    const unsubscribe = roomsRef.doc(roomName).onSnapshot(snapshot => {
      const roomData = snapshot.data()

      if (roomData) {
        setRoom(roomData)
      }
    })

    return unsubscribe
  }, [roomName])

  return room
}
