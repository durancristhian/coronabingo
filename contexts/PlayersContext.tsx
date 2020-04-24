import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Player, PlayersContextData } from '~/interfaces'
import { roomsRef } from '~/utils/firebase'

const PlayersContext = createContext<PlayersContextData>({
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

  const sortAndSet = (players: Player[]) => {
    setPlayers(players.sort((a, b) => a.name.localeCompare(b.name)))
  }

  useEffect(() => {
    if (!roomId) return

    return roomsRef
      .doc(roomId)
      .collection('players')
      .onSnapshot(
        snapshot => {
          sortAndSet(
            snapshot.docs.map(p => {
              const playerData = p.data() as Player

              return Object.assign(
                {},
                {
                  id: p.id,
                  exists: p.exists,
                  ref: p.ref,
                },
                playerData,
              )
            }),
          )
        },
        error => {
          console.error(error)
        },
      )
  }, [roomId])

  return (
    <PlayersContext.Provider
      value={{
        players,
        setPlayers: sortAndSet,
      }}
    >
      {children}
    </PlayersContext.Provider>
  )
}

export { PlayersContext, PlayersContextProvider }
