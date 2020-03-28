import { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { IPlayer } from '~/components/Players'

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
}

let firebaseApp

if (firebase.apps.length) {
  firebaseApp = firebase.apps[0]
} else {
  firebaseApp = firebase.initializeApp(firebaseConfig)
}

const db = firebaseApp.firestore()

export default db
export const roomsRef = db.collection('rooms')

export function useRoom(roomName: string): firebase.firestore.DocumentData {
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

export function usePlayers(roomName: string): IPlayer[] {
  const [players, setPlayers] = useState<IPlayer[]>([])

  useEffect(() => {
    if (!roomName) return
    const unsubscribe = roomsRef
      .doc(roomName)
      .collection('players')
      .onSnapshot(snapshot => {
        setPlayers(
          snapshot.docs.map(p => {
            const data = p.data()
            return {
              id: p.id,
              name: data.name,
              boards: data.boards,
              selectedNumbers: data.selectedNumbers
            }
          })
        )
      })
    return unsubscribe
  }, [roomName])

  return players
}
