import { useRouter } from 'next/router'
import React, {
  createContext,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { RoomContextData } from '~/interfaces/contexts/Room'
import { RemoteData, REMOTE_DATA } from '~/interfaces/custom/RemoteData'
import { Room, RoomBase } from '~/interfaces/models/Room'

const RoomContext = createContext<RoomContextData>({
  state: { type: REMOTE_DATA.NOT_ASKED },
  updateRoom: () => void 0,
})

interface Props {
  children: ReactNode
}

const RoomContextProvider = ({ children }: Props) => {
  const router = useRouter()
  const roomId = router.pathname.startsWith('/room/')
    ? router.query.roomId?.toString()
    : undefined
  const activeRoomId = useRef(roomId)
  activeRoomId.current = roomId
  const draftsByRoom = useRef(new Map<string, Partial<RoomBase>>())
  const [state, setState] = useState<RemoteData<Error, Room | null>>({
    type: REMOTE_DATA.NOT_ASKED,
  })

  const updateRoom = (partialRoom: Partial<RoomBase>) => {
    if (
      !roomId ||
      activeRoomId.current !== roomId ||
      state.type !== REMOTE_DATA.SUCCESS ||
      state.data?.id !== roomId
    )
      return
    draftsByRoom.current.set(roomId, {
      ...draftsByRoom.current.get(roomId),
      ...partialRoom,
    })
    setState(prevState => {
      if (
        prevState.type !== REMOTE_DATA.SUCCESS ||
        !prevState.data ||
        prevState.data.id !== roomId
      ) {
        return prevState
      }

      return {
        type: REMOTE_DATA.SUCCESS,
        data: Object.assign({}, prevState.data, partialRoom),
      }
    })
  }

  useEffect(() => {
    if (!roomId) return

    setState({ type: REMOTE_DATA.LOADING })

    let active = true
    let unsubscribe: (() => void) | undefined
    void import('~/utils/firebase').then(
      ({ roomsRef }) => {
        if (!active) return

        unsubscribe = roomsRef.doc(roomId).onSnapshot(
          { includeMetadataChanges: true },
          snapshot => {
            if (!active) return
            if (snapshot.metadata.hasPendingWrites) return
            if (!snapshot.exists) {
              draftsByRoom.current.delete(roomId)
              setState({
                type: REMOTE_DATA.SUCCESS,
                data: null,
              })

              return
            }

            const roomData = snapshot.data() as RoomBase
            const draft = draftsByRoom.current.get(roomId)
            // Acknowledge saved fields individually; unrelated snapshots must
            // not erase setup choices that have not reached Firestore yet.
            const pendingDraft = Object.fromEntries(
              Object.entries(draft || {}).filter(
                ([key, value]) => roomData[key as keyof RoomBase] !== value,
              ),
            )
            if (Object.keys(pendingDraft).length) {
              draftsByRoom.current.set(roomId, pendingDraft)
            } else {
              draftsByRoom.current.delete(roomId)
            }
            const room = {
              ...roomData,
              ...pendingDraft,
              id: snapshot.id,
              ref: snapshot.ref,
            }

            setState({ type: REMOTE_DATA.SUCCESS, data: room })
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
  }, [roomId])

  return (
    <RoomContext.Provider value={{ state, updateRoom }}>
      {children}
    </RoomContext.Provider>
  )
}

export { RoomContext, RoomContextProvider }
