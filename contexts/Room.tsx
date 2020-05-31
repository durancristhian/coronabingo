import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Room, RoomBase, RoomContextData } from '~/interfaces'
import { roomsRef } from '~/utils'

const RoomContext = createContext<RoomContextData>({
  error: '',
  loading: false,
  updateRoom: () => void 0,
})

interface Props {
  children: ReactNode
}

const RoomContextProvider = ({ children }: Props) => {
  const router = useRouter()
  const roomId = router.query.roomId?.toString()
  const [room, setRoom] = useState<Room>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const updateRoom = (data: Partial<RoomBase>) => {
    setRoom(Object.assign({}, room, data))
  }

  useEffect(() => {
    if (!roomId) return

    setLoading(true)

    const unsubscribe = roomsRef.doc(roomId).onSnapshot(
      snapshot => {
        if (snapshot.exists) {
          const roomData = snapshot.data() as Room

          setRoom(
            Object.assign(
              {},
              {
                id: snapshot.id,
                exists: snapshot.exists,
                ref: snapshot.ref,
              },
              roomData,
            ),
          )
        } else {
          setError('ROOM_DOES_NOT_EXIST')
        }

        setLoading(false)
      },
      error => {
        setError('COULD_NOT_FETCH_ROOM')
        setLoading(false)

        console.error(error)
      },
    )

    return unsubscribe
  }, [roomId])

  return (
    <RoomContext.Provider value={{ error, loading, room, updateRoom }}>
      {children}
    </RoomContext.Provider>
  )
}

export { RoomContext, RoomContextProvider }
