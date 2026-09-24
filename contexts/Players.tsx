import { useRouter } from 'next/router'
import React, {
  createContext,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { PlayersContextData } from '~/interfaces/contexts/Players'
import { RemoteData, REMOTE_DATA } from '~/interfaces/custom/RemoteData'
import { Player, PlayerBase } from '~/interfaces/models/Player'
import { roomsRef } from '~/utils/firebase'

const playerListRoutes = ['/room/[roomId]', '/room/[roomId]/admin']

const PlayersContext = createContext<PlayersContextData>({
  state: { type: REMOTE_DATA.NOT_ASKED },
  setPlayers: () => void 0,
})

interface Props {
  children: ReactNode
}

interface ScopedPlayersState {
  roomId?: string
  state: RemoteData<Error, Player[]>
}

const haveSamePlayerIds = (first: Player[], second: Player[]) => {
  if (first.length !== second.length) {
    return false
  }

  const secondIds = new Set(second.map(player => player.id))

  return first.every(player => secondIds.has(player.id))
}

const PlayersContextProvider = ({ children }: Props) => {
  const router = useRouter()
  const roomId = router.query.roomId?.toString()
  const shouldListenToPlayers = playerListRoutes.includes(router.pathname)
  const draftsByRoom = useRef(new Map<string, Player[]>())
  const subscriptionId = useRef(0)
  const [scopedState, setScopedState] = useState<ScopedPlayersState>({
    state: { type: REMOTE_DATA.NOT_ASKED },
  })

  const sortAndSet = (players: Player[]) => {
    if (!roomId || !shouldListenToPlayers) {
      return
    }

    const sortedPlayers = [...players].sort((a, b) =>
      a.name.localeCompare(b.name),
    )

    draftsByRoom.current.set(roomId, sortedPlayers)
    setScopedState({
      roomId,
      state: {
        type: REMOTE_DATA.SUCCESS,
        data: sortedPlayers,
      },
    })
  }

  useEffect(() => {
    const currentSubscriptionId = ++subscriptionId.current

    if (!roomId || !shouldListenToPlayers) {
      return
    }

    setScopedState(previousState =>
      previousState.roomId === roomId
        ? previousState
        : { roomId, state: { type: REMOTE_DATA.LOADING } },
    )

    const unsubscribe = roomsRef
      .doc(roomId)
      .collection('players')
      .onSnapshot(
        snapshot => {
          if (subscriptionId.current !== currentSubscriptionId) {
            return
          }

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

          const draft = draftsByRoom.current.get(roomId)

          if (draft && !haveSamePlayerIds(draft, players)) {
            setScopedState({
              roomId,
              state: { type: REMOTE_DATA.SUCCESS, data: draft },
            })

            return
          }

          draftsByRoom.current.delete(roomId)
          setScopedState({
            roomId,
            state: { type: REMOTE_DATA.SUCCESS, data: players },
          })
        },
        error => {
          if (subscriptionId.current !== currentSubscriptionId) {
            return
          }

          setScopedState({
            roomId,
            state: { type: REMOTE_DATA.FAILURE, error },
          })

          console.error(error)
        },
      )

    return () => {
      subscriptionId.current += 1
      unsubscribe()
    }
  }, [roomId, shouldListenToPlayers])

  const state =
    roomId && shouldListenToPlayers && scopedState.roomId === roomId
      ? scopedState.state
      : { type: REMOTE_DATA.NOT_ASKED as const }

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
