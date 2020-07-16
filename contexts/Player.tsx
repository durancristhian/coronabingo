import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import {
  Player,
  PlayerBase,
  PlayerContextData,
  RemoteData,
  REMOTE_DATA,
} from '~/interfaces'
import { roomsRef } from '~/utils'

const PlayerContext = createContext<PlayerContextData>({
  state: { type: REMOTE_DATA.NOT_ASKED },
  updatePlayer: () => void 0,
})

interface Props {
  children: ReactNode
}

const PlayerContextProvider = ({ children }: Props) => {
  const router = useRouter()
  const playerId = router.query.playerId?.toString()
  const roomId = router.query.roomId?.toString()
  const [state, setState] = useState<RemoteData<Error, Player>>({
    type: REMOTE_DATA.NOT_ASKED,
  })

  const updatePlayer = (partialPlayer: Partial<PlayerBase>) => {
    setState(prevState => {
      if (prevState.type !== REMOTE_DATA.SUCCESS) {
        return prevState
      }

      return {
        type: REMOTE_DATA.SUCCESS,
        data: Object.assign({}, prevState.data, partialPlayer),
      }
    })
  }

  useEffect(() => {
    if (!playerId) return

    setState({ type: REMOTE_DATA.LOADING })

    const unsubscribe = roomsRef
      .doc(`${roomId}/players/${playerId}`)
      .onSnapshot(
        snapshot => {
          if (!snapshot.exists) {
            setState({
              type: REMOTE_DATA.FAILURE,
              error: new Error('Deleted player'),
            })

            return
          }

          const playerData = snapshot.data() as PlayerBase
          const player = {
            ...playerData,
            id: snapshot.id,
            ref: snapshot.ref,
          }

          setState({ type: REMOTE_DATA.SUCCESS, data: player })
        },
        error => {
          setState({ type: REMOTE_DATA.FAILURE, error })

          console.error(error)
        },
      )

    return unsubscribe
  }, [playerId])

  return (
    <PlayerContext.Provider value={{ state, updatePlayer }}>
      {children}
    </PlayerContext.Provider>
  )
}

export { PlayerContext, PlayerContextProvider }
