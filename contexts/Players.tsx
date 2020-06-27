import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Player, PlayersContextData } from '~/interfaces'
import { roomsRef } from '~/utils'

const PlayersContext = createContext<PlayersContextData>({
  error: '',
  loading: false,
  players: [],
  setPlayers: () => null,
})

interface Props {
  children: ReactNode
}

const PlayersContextProvider = ({ children }: Props) => {
  const router = useRouter()
  const roomId = router.query.roomId?.toString()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const sortAndSet = (players: Player[]) => {
    setPlayers(players.sort((a, b) => a.name.localeCompare(b.name)))
  }

  useEffect(() => {
    if (!roomId) return

    setLoading(true)

    return roomsRef
      .doc(roomId)
      .collection('players')
      .onSnapshot(
        snapshot => {
          sortAndSet(
            snapshot.docs
              .filter(p => p.exists)
              .map(p => {
                const playerData = p.data() as Player

                return {
                  ...playerData,
                  id: p.id,
                  ref: p.ref,
                }
              }),
          )

          setLoading(false)
        },
        error => {
          setError('COULD_NOT_FETCH_PLAYERS')
          setLoading(false)

          console.error(error)
        },
      )
  }, [roomId])

  return (
    <PlayersContext.Provider
      value={{
        error,
        loading,
        players,
        setPlayers: sortAndSet,
      }}
    >
      {children}
    </PlayersContext.Provider>
  )
}

export { PlayersContext, PlayersContextProvider }
