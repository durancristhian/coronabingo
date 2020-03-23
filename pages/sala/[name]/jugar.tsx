import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import Boards from '~/components/Boards'
import Message from '~/components/Message'
import { IPlayer } from '~/components/Players'
import SelectedNumbers from '~/components/SelectedNumbers'
import db from '~/utils/firebase'

export default function Jugar() {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const playerId = router.query.jugador?.toString()
  const [room, setRoom] = useState<
    firebase.firestore.DocumentData | undefined
  >()
  const isAdmin = room?.adminId === playerId
  const currentPlayer = room?.players.find((p: IPlayer) => p.id === playerId)

  useEffect(() => {
    if (!roomName) return

    const unsubscribe = db
      .collection('rooms')
      .doc(roomName)
      .onSnapshot(doc => {
        setRoom(doc.data())
      })

    return unsubscribe
  }, [roomName])

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-medium text-center text-xl">Sala {roomName}</h2>
        {!room && (
          <div className="md:w-2/4 mx-auto px-4">
            <Message type="information">
              Cargando información de la sala...
            </Message>
          </div>
        )}
        {room && (
          <Fragment>
            <Boards
              boards={currentPlayer.boards}
              selectedNumbers={currentPlayer.selectedNumbers}
            />
            <SelectedNumbers
              isAdmin={isAdmin}
              selectedNumbers={room.selectedNumbers || []}
            />
          </Fragment>
        )}
      </div>
    </div>
  )
}
