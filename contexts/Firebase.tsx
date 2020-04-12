import { ParsedUrlQuery } from 'querystring'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Player } from '~/components/Players'
import { roomsRef } from '~/utils/firebase'

interface Context {
  currentPlayer?: Player
  setCurrentPlayer: (array: Player) => void
  players: Player[]
  room?: firebase.firestore.DocumentData
  changeRoom: (data: {}) => void
  setPlayers: (array: Player[]) => void
}

const FirebaseContext = createContext<Context>({
  players: [],
  changeRoom: () => null,
  setPlayers: () => null,
  setCurrentPlayer: () => null,
})

interface Props {
  children: ReactNode
  routerQuery: ParsedUrlQuery
}

const FirebaseProvider = ({ children, routerQuery }: Props) => {
  const roomId = routerQuery.roomId?.toString()
  const playerId = routerQuery.playerId?.toString()
  const [room, setRoom] = useState({})
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<Player>()

  const sortAndSet = (array: Player[]) =>
    setPlayers(array.sort((a, b) => a.name.localeCompare(b.name)))

  const changeRoom = (data: {}) => setRoom({ ...room, ...data })

  useEffect(() => {
    if (!roomId) return
    const unsubscribe = roomsRef.doc(roomId).onSnapshot(snapshot => {
      const roomData = snapshot.data()
      if (roomData) {
        setRoom({
          id: snapshot.id,
          exists: snapshot.exists,
          ref: snapshot.ref,
          ...roomData,
        })
      }
    })

    return unsubscribe
  }, [roomId])

  useEffect(() => {
    if (!roomId) return
    return playerId
      ? roomsRef.doc(`${roomId}/players/${playerId}`).onSnapshot(p =>
          setCurrentPlayer({
            id: p.id,
            exists: p.exists,
            ref: p.ref,
            ...(p.data() as Player),
          }),
        )
      : roomsRef
          .doc(roomId)
          .collection('players')
          .onSnapshot(snapshot => {
            sortAndSet(
              snapshot.docs.map(p => ({
                id: p.id,
                exists: p.exists,
                ref: p.ref,
                ...(p.data() as Player),
              })),
            )
          })
  }, [roomId, playerId])

  return (
    <FirebaseContext.Provider
      value={{
        currentPlayer,
        setCurrentPlayer,
        players,
        room,
        changeRoom,
        setPlayers: sortAndSet,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export { FirebaseContext, FirebaseProvider }
