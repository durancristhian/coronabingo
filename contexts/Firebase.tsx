import { ParsedUrlQuery } from 'querystring'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { FirebaseContextData, Player } from '~/interfaces'
import { roomsRef } from '~/utils/firebase'

const FirebaseContext = createContext<FirebaseContextData>({
  players: [],
  setPlayers: () => null,
})

interface Props {
  children: ReactNode
  routerQuery: ParsedUrlQuery
}

const FirebaseProvider = ({ children, routerQuery }: Props) => {
  const roomId = routerQuery.roomId?.toString()
  const [players, setPlayers] = useState<Player[]>([])

  const sortAndSet = (array: Player[]) =>
    setPlayers(array.sort((a, b) => a.name.localeCompare(b.name)))

  useEffect(() => {
    if (!roomId) return

    return roomsRef
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
  }, [roomId])

  return (
    <FirebaseContext.Provider
      value={{
        players,
        setPlayers: sortAndSet,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export { FirebaseContext, FirebaseProvider }
