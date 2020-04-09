import { ParsedUrlQuery } from 'querystring'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Player } from '~/components/Players'
import api from '~/utils/firebase/api'

interface Context {
  currentPlayer?: Player
  players: Player[]
  room?: firebase.firestore.DocumentData
  changeRoom: (data: {}) => void
  setPlayers: (array: Player[]) => void
}

const FirebaseContext = createContext<Context>({
  players: [],
  changeRoom: () => null,
  setPlayers: () => null,
})

interface Props {
  children: ReactNode
  routerQuery: ParsedUrlQuery
}

const FirebaseProvider = ({ children, routerQuery }: Props) => {
  const roomId = routerQuery.roomId?.toString()
  const playerId = routerQuery.playerId?.toString()
  const [room, setRoom] = useState<firebase.firestore.DocumentData>({})
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<Player>()

  const sortAndSet = (array: Player[]) =>
    setPlayers(array.sort((a, b) => a.name.localeCompare(b.name)))

  const changeRoom = (data: {}) => setRoom({ ...room, ...data })

  useEffect(() => {
    if (!roomId) return
    const unsubscribe = api.room.onChange(roomId, setRoom)
    return unsubscribe
  }, [roomId])

  useEffect(() => {
    if (!room.id) return
    const unsubscribe = api.players.onChange(room.ref, sortAndSet)
    return unsubscribe
  }, [room])

  useEffect(() => {
    if (!players || !playerId) return
    setCurrentPlayer(players.find(player => player.id === playerId))
  }, [players, playerId])

  return (
    <FirebaseContext.Provider
      value={{
        currentPlayer,
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
