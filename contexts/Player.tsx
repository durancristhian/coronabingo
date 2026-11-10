import firebase from 'firebase/compat/app'
import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { PlayerContextData } from '~/interfaces/contexts/Player'
import { RemoteData, REMOTE_DATA } from '~/interfaces/custom/RemoteData'
import { Player, PlayerBase } from '~/interfaces/models/Player'
import { subscribeToFirestore } from '~/utils/firestoreSubscription'

const PlayerContext = createContext<PlayerContextData>({
  state: { type: REMOTE_DATA.NOT_ASKED },
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

  useEffect(() => {
    if (!roomId || !playerId) return

    setState({ type: REMOTE_DATA.LOADING })

    return subscribeToFirestore<firebase.firestore.DocumentSnapshot>(
      ({ roomsRef }, next, fail) =>
        roomsRef
          .doc(`${roomId}/players/${playerId}`)
          .onSnapshot({ includeMetadataChanges: true }, next, fail),
      snapshot => {
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
        setState({ type: REMOTE_DATA.FAILURE, error })
        console.error(error)
      },
    )
  }, [roomId, playerId])

  return (
    <PlayerContext.Provider value={{ state }}>
      {children}
    </PlayerContext.Provider>
  )
}

export { PlayerContext, PlayerContextProvider }
