import Mousetrap from 'mousetrap'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiCloudSnow } from 'react-icons/fi'
import BackgroundCells from '~/components/BackgroundCells'
import Boards from '~/components/Boards'
import Button from '~/components/Button'
import Confetti from '~/components/Confetti'
import Message from '~/components/Message'
import SelectedNumbers from '~/components/SelectedNumbers'
import TurningGlob from '~/components/TurningGlob'
import { BackgroundCellContextProvider } from '~/contexts/BackgroundCellContext'
import { roomsRef } from '~/utils/firebase'

export default function Jugar() {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const playerId = router.query.jugador?.toString()
  const [room, setRoom] = useState<firebase.firestore.DocumentData>()
  const [player, setPlayer] = useState<firebase.firestore.DocumentData>()
  const [showExperiments, setShowExperiments] = useState(false)
  const isAdmin = Boolean(room?.adminId) && room?.adminId === playerId

  useEffect(() => {
    if (!roomName) return

    const unsubscribe = roomsRef.doc(roomName).onSnapshot(doc => {
      setRoom(doc.data())
    })

    return unsubscribe
  }, [roomName])

  useEffect(() => {
    if (isAdmin) {
      Mousetrap.bind('e x p e r i m e n t o s', () => {
        setShowExperiments(true)
      })
    }
  }, [isAdmin])

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

  const confetti = () => {
    const roomRef = roomsRef.doc(roomName)
    roomRef.update({ showConfetti: true })

    setTimeout(() => {
      roomRef.update({ showConfetti: false })
    }, 10000)
  }

  return (
    <BackgroundCellContextProvider>
      {room?.showConfetti && <Confetti />}
      <div className="px-4 py-8">
        <h2 className="font-medium text-center text-xl">Sala {roomName}</h2>
        {!room && (
          <div className="max-w-4xl mx-auto">
            <div className="md:w-2/4 mx-auto">
              <Message type="information">
                Cargando información de la sala...
              </Message>
            </div>
          </div>
        )}
        <div className="max-w-6xl mx-auto">
          <div className="lg:flex mt-8">
            {room && (
              <div className="lg:w-1/3">
                <div className="bg-white px-4 py-8 rounded shadow">
                  <h2 className="font-medium mb-4 text-center text-xl">
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
        <div className="max-w-4xl mt-8 mx-auto">
          <div className="bg-white md:w-2/4 mx-auto px-4 py-8 rounded shadow">
            <BackgroundCells />
          </div>
        </div>
        {showExperiments && (
          <div className="max-w-4xl mt-8 mx-auto">
            <h2 className="font-medium text-center text-xl">Experimentos</h2>
            <div className="my-8">
              <Button onClick={confetti}>
                <FiCloudSnow className="text-lg" />
                <span className="ml-4">Llueve confetti</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </BackgroundCellContextProvider>
  )
}
