import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Boards from '~/components/Boards'
import Message from '~/components/Message'
import SelectedNumbers from '~/components/SelectedNumbers'
import TurningGlob from '~/components/TurningGlob'
import { roomsRef } from '~/utils/firebase'

export default function Jugar() {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const playerId = router.query.jugador?.toString()
  const [room, setRoom] = useState<
    firebase.firestore.DocumentData | undefined
  >()
  const [player, setPlayer] = useState<
    firebase.firestore.DocumentData | undefined
  >()
  const isAdmin = room?.adminId === playerId

  useEffect(() => {
    if (!roomName) return

    const unsubscribe = roomsRef.doc(roomName).onSnapshot(doc => {
      setRoom(doc.data())
    })

    return unsubscribe
  }, [roomName])

  useEffect(() => {
    if (!playerId || !roomName) return

    const unsubscribe = roomsRef
      .doc(roomName)
      .collection('players')
      .doc(playerId)
      .onSnapshot(doc => {
        setPlayer({
          id: doc.id,
          ...doc.data()
        })
      })

    return unsubscribe
  }, [playerId, roomName])

  const onNewNumber = (n: number) => {
    if (!room) return

    const selectedNumbers = room.selectedNumbers || []
    let numbers

    if (selectedNumbers.includes(n)) {
      numbers = selectedNumbers.filter((sn: number) => sn !== n)
    } else {
      numbers = [n, ...selectedNumbers]
    }

    roomsRef.doc(roomName).update({
      selectedNumbers: numbers
    })
  }

  return (
    <div className="px-4 py-8">
      {!room && (
        <div className="max-w-4xl mx-auto">
          <div className="md:w-2/4 mx-auto -mt-8">
            <Message type="information">
              Cargando información de la sala...
            </Message>
          </div>
        </div>
      )}
      <div className="lg:flex max-w-6xl mx-auto">
        {room && (
          <div className="lg:w-1/3">
            <div className="bg-white px-4 py-8 rounded shadow">
              <h2 className="font-medium mb-8 text-center text-xl">
                Bolillero
              </h2>
              <TurningGlob
                isAdmin={isAdmin}
                onNewNumber={onNewNumber}
                selectedNumbers={room?.selectedNumbers || []}
                turningGlob={room?.turningGlob}
              />
              <div className="mt-4">
                <SelectedNumbers
                  isAdmin={isAdmin}
                  onNewNumber={onNewNumber}
                  selectedNumbers={room.selectedNumbers || []}
                  turningGlob={room.turningGlob}
                />
              </div>
            </div>
          </div>
        )}
        <div className="pt-4 lg:pt-0 lg:pl-4 lg:w-2/3">
          {player && <Boards boards={player.boards} />}
        </div>
      </div>
    </div>
  )
}
