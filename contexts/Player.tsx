import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { PlayerContextData } from '~/interfaces/contexts/Player'
import { RemoteData, REMOTE_DATA } from '~/interfaces/custom/RemoteData'
import { Player, PlayerBase } from '~/interfaces/models/Player'

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
  const roomId = router.pathname.startsWith('/room/')
    ? router.query.roomId?.toString()
    : undefined
  const [state, setState] = useState<RemoteData<Error, Player | null>>({
    type: REMOTE_DATA.NOT_ASKED,
  })

  const updatePlayer = (partialPlayer: Partial<PlayerBase>) => {
    setState(prevState => {
      if (prevState.type !== REMOTE_DATA.SUCCESS || !prevState.data) {
        return prevState
      }

      return {
        type: REMOTE_DATA.SUCCESS,
        data: Object.assign({}, prevState.data, partialPlayer),
      }
    })
  }

  useEffect(() => {
    if (!roomId || !playerId) return

    setState({ type: REMOTE_DATA.LOADING })

    let active = true
    let unsubscribe: (() => void) | undefined
    void import('~/utils/firebase').then(
      ({ roomsRef }) => {
        if (!active) return

        unsubscribe = roomsRef.doc(`${roomId}/players/${playerId}`).onSnapshot(
          { includeMetadataChanges: true },
          snapshot => {
            if (!active) return
            if (snapshot.metadata.hasPendingWrites) return

            if (!snapshot.exists) {
              setState({
                type: REMOTE_DATA.SUCCESS,
                data: null,
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
            if (!active) return
            setState({ type: REMOTE_DATA.FAILURE, error })

            console.error(error)
          },
        )
      },
      error => {
        if (active) setState({ type: REMOTE_DATA.FAILURE, error })
      },
    )

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [roomId, playerId])

  return (
    <PlayerContext.Provider value={{ state, updatePlayer }}>
      {children}
    </PlayerContext.Provider>
  )
}

export { PlayerContext, PlayerContextProvider }
