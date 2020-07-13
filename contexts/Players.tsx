import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import {
  Player,
  PlayerBase,
  PlayersContextData,
  RemoteData,
  REMOTE_DATA,
} from '~/interfaces'
import { roomsRef } from '~/utils'

const PlayersContext = createContext<PlayersContextData>({
  state: { type: REMOTE_DATA.NOT_ASKED },
  setPlayers: () => void 0,
})

interface Props {
  children: ReactNode
}

const PlayersContextProvider = ({ children }: Props) => {
  const router = useRouter()
  const roomId = router.query.roomId?.toString()
  const [state, setState] = useState<RemoteData<Error, Player[]>>({
    type: REMOTE_DATA.NOT_ASKED,
  })

  const sortAndSet = (players: Player[]) => {
    setState(prevState => {
      if (prevState.type !== REMOTE_DATA.SUCCESS) {
        return prevState
      }

      return {
        type: REMOTE_DATA.SUCCESS,
        data: players.sort((a, b) => a.name.localeCompare(b.name)),
      }
    })
  }

  useEffect(() => {
    if (!roomId) return

    setState({ type: REMOTE_DATA.LOADING })

    return roomsRef
      .doc(roomId)
      .collection('players')
      .onSnapshot(
        snapshot => {
          const players = snapshot.docs
            .filter(p => p.exists)
            .map(p => {
              const playerData = p.data() as PlayerBase

              return {
                ...playerData,
                id: p.id,
                ref: p.ref,
              }
            })
            .sort((a, b) => a.name.localeCompare(b.name))

          setState({ type: REMOTE_DATA.SUCCESS, data: players })
        },
        error => {
          setState({ type: REMOTE_DATA.FAILURE, error })

          console.error(error)
        },
      )
  }, [roomId])

  return (
    <PlayersContext.Provider
      value={{
        state,
        setPlayers: sortAndSet,
      }}
    >
      {children}
    </PlayersContext.Provider>
  )
}

export { PlayersContext, PlayersContextProvider }
