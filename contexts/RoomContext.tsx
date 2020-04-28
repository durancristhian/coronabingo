import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Room, RoomBase, RoomContextData } from '~/interfaces'
import { roomsRef } from '~/utils/firebase'

const RoomContext = createContext<RoomContextData>({
  updateRoom: () => void 0,
})

interface Props {
  children: ReactNode
}

const RoomContextProvider = ({ children }: Props) => {
  const router = useRouter()
  const roomId = router.query.roomId?.toString()
  const [room, setRoom] = useState<Room>()

  const updateRoom = (data: Partial<RoomBase>) => {
    setRoom(Object.assign({}, room, data))
  }

  useEffect(() => {
    if (!roomId) return

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
        }
      },
      error => {
        console.error(error)
      },
    )

    return unsubscribe
  }, [roomId])

  return (
    <RoomContext.Provider value={{ room, updateRoom }}>
      {children}
    </RoomContext.Provider>
  )
}

export { RoomContext, RoomContextProvider }
