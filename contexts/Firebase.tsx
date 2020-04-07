import { createContext, ReactNode, useState, useEffect } from 'react'
import { roomsRef } from '~/utils/firebase'
import { ParsedUrlQuery } from 'querystring'
import { IPlayer } from '~/components/Players'

interface IContext {
  currentPlayer?: IPlayer
  players: IPlayer[]
  room?: firebase.firestore.DocumentData
  setPlayers: (array: IPlayer[]) => void
}

const FirebaseContext = createContext<IContext>({
  players: [],
  setPlayers: () => null
})

interface IProps {
  children: ReactNode
  routerQuery: ParsedUrlQuery
}

const FirebaseProvider = ({ children, routerQuery }: IProps) => {
  const roomId = routerQuery.roomId?.toString()
  const playerId = routerQuery.playerId?.toString()
  const [room, setRoom] = useState({})
  const [players, setPlayers] = useState<IPlayer[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<IPlayer>()

  const sortAndSet = (array: IPlayer[]) =>
    setPlayers(array.sort((a, b) => a.name.localeCompare(b.name)))

  useEffect(() => {
    if (!roomId) return
    const unsubscribe = roomsRef.doc(roomId).onSnapshot(snapshot => {
      const roomData = snapshot.data()
      if (roomData) {
        setRoom({ id: snapshot.id, ...roomData })
      }
    })

    return unsubscribe
  }, [roomId])

  useEffect(() => {
    if (!roomId) return
    const unsubscribe = roomsRef
      .doc(roomId)
      .collection('players')
      .onSnapshot(snapshot => {
        sortAndSet(
          snapshot.docs.map(p => {
            const data = p.data() as IPlayer

            return {
              id: p.id,
              ...data
            }
          })
        )
      })

    return unsubscribe
  }, [roomId])

  useEffect(() => {
    if (!players || !playerId) return
    setCurrentPlayer(players.find(player => player.id === playerId))
  }, [players, playerId])

  return (
    <FirebaseContext.Provider
      value={{ currentPlayer, players, room, setPlayers: sortAndSet }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export { FirebaseContext, FirebaseProvider }
