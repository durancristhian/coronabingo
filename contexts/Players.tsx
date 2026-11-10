import firebase from 'firebase/compat/app'
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
import { subscribeToFirestore } from '~/utils/firestoreSubscription'

const playerListRoutes = ['/room/[roomId]', '/room/[roomId]/admin']

const PlayersContext = createContext<PlayersContextData>({
  state: { type: REMOTE_DATA.NOT_ASKED },
  setPlayers: () => void 0,
  removePlayer: async () => undefined,
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
  const activeScope = useRef({ roomId, shouldListenToPlayers })
  activeScope.current = { roomId, shouldListenToPlayers }
  const serverPlayersByRoom = useRef(new Map<string, Player[]>())
  const removalsByRoom = useRef(new Map<string, Map<string, Player>>())
  const draftsByRoom = useRef(new Map<string, Player[]>())
  const [scopedState, setScopedState] = useState<ScopedPlayersState>({
    state: { type: REMOTE_DATA.NOT_ASKED },
  })

  const publishPlayers = (ownerRoomId: string, fromSnapshot = false) => {
    if (
      activeScope.current.roomId !== ownerRoomId ||
      !activeScope.current.shouldListenToPlayers
    )
      return
    const base =
      draftsByRoom.current.get(ownerRoomId) ||
      serverPlayersByRoom.current.get(ownerRoomId) ||
      []
    const pending = removalsByRoom.current.get(ownerRoomId)
    const players = [...base]
    pending?.forEach(player => {
      if (!players.some(item => item.id === player.id)) players.push(player)
    })
    setScopedState(previous => {
      if (
        !fromSnapshot &&
        previous.roomId === ownerRoomId &&
        previous.state.type === REMOTE_DATA.FAILURE
      )
        return previous
      return {
        roomId: ownerRoomId,
        state: {
          type: REMOTE_DATA.SUCCESS,
          data: players.sort((a, b) => a.name.localeCompare(b.name)),
        },
      }
    })
  }

  const removePlayer = async (player: Player) => {
    if (
      !roomId ||
      activeScope.current.roomId !== roomId ||
      !activeScope.current.shouldListenToPlayers
    )
      return
    const pending =
      removalsByRoom.current.get(roomId) || new Map<string, Player>()
    pending.set(player.id, player)
    removalsByRoom.current.set(roomId, pending)
    try {
      await player.ref.delete()
      const draft = draftsByRoom.current.get(roomId)
      if (draft)
        draftsByRoom.current.set(
          roomId,
          draft.filter(item => item.id !== player.id),
        )
      serverPlayersByRoom.current.set(
        roomId,
        (serverPlayersByRoom.current.get(roomId) || []).filter(
          item => item.id !== player.id,
        ),
      )
    } catch (error) {
      // Rollback notifications can follow rejection; restore visibility now.
      const server = serverPlayersByRoom.current.get(roomId) || []
      if (!server.some(item => item.id === player.id))
        serverPlayersByRoom.current.set(roomId, [...server, player])
      throw error
    } finally {
      pending.delete(player.id)
      if (!pending.size) removalsByRoom.current.delete(roomId)
      publishPlayers(roomId)
    }
  }

  const sortAndSet = (players: Player[]) => {
    if (
      !roomId ||
      !shouldListenToPlayers ||
      activeScope.current.roomId !== roomId ||
      !activeScope.current.shouldListenToPlayers
    ) {
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
    if (!roomId || !shouldListenToPlayers) {
      return
    }

    setScopedState(previousState =>
      previousState.roomId === roomId
        ? previousState
        : { roomId, state: { type: REMOTE_DATA.LOADING } },
    )

    return subscribeToFirestore<firebase.firestore.QuerySnapshot>(
      ({ roomsRef }, next, fail) =>
        roomsRef
          .doc(roomId)
          .collection('players')
          .onSnapshot({ includeMetadataChanges: true }, next, fail),
      snapshot => {
        if (snapshot.metadata.hasPendingWrites) return

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

        serverPlayersByRoom.current.set(roomId, players)
        const draft = draftsByRoom.current.get(roomId)
        if (draft && haveSamePlayerIds(draft, players))
          draftsByRoom.current.delete(roomId)
        // Query metadata may omit an in-flight deletion. Its promise,
        // rather than row absence, owns the completion transition.
        publishPlayers(roomId, true)
      },
      error => {
        setScopedState({
          roomId,
          state: { type: REMOTE_DATA.FAILURE, error },
        })
        console.error(error)
      },
    )
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
        removePlayer,
      }}
    >
      {children}
    </PlayersContext.Provider>
  )
}

export { PlayersContext, PlayersContextProvider }
