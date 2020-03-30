import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { FiFrown, FiSmile } from 'react-icons/fi'
import BackgroundCells from '~/components/BackgroundCells'
import Boards from '~/components/Boards'
import Button from '~/components/Button'
import Confetti from '~/components/Confetti'
import Message from '~/components/Message'
import SelectedNumbers from '~/components/SelectedNumbers'
import TurningGlob from '~/components/TurningGlob'
import { BackgroundCellContextProvider } from '~/contexts/BackgroundCellContext'
import { EasterEggContext } from '~/contexts/EasterEggContext'
import useRoom from '~/hooks/useRoom'
import { roomsRef } from '~/utils/firebase'

export default function Jugar() {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const playerId = router.query.jugador?.toString()
  const room = useRoom(roomName)
  /* TODO: can we make a custom hook? */
  const [player, setPlayer] = useState<firebase.firestore.DocumentData>()
  const isAdmin = room?.adminId === playerId
  const { isVisible } = useContext(EasterEggContext)

  useEffect(() => {
    if (!playerId || !roomName) return

    roomsRef
      .doc(roomName)
      .collection('players')
      .doc(playerId)
      .get()
      .then(doc =>
        setPlayer({
          id: doc.id,
          ...doc.data()
        })
      )
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
    roomRef.update({ showConfetti: !room?.showConfetti })
  }

  return (
    <BackgroundCellContextProvider>
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
                    Últimos números
                  </h2>
                  <TurningGlob selectedNumbers={room?.selectedNumbers || []} />
                </div>
                <div className="hidden lg:block mt-8">
                  <div className="bg-white px-4 py-8 rounded shadow">
                    <h2 className="font-medium mb-4 text-center text-xl">
                      Bolillero
                    </h2>
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
              </div>
            )}
            <div className="pt-4 lg:pt-0 lg:pl-4 lg:w-2/3">
              {player && (
                <Boards
                  player={player}
                  setPlayerProps={newProps =>
                    setPlayer({
                      ...player,
                      ...newProps
                    })
                  }
                />
              )}
            </div>
            <div className="lg:hidden mt-8">
              <div className="bg-white px-4 py-8 rounded shadow">
                <h2 className="font-medium mb-4 text-center text-xl">
                  Bolillero
                </h2>
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
          </div>
        </div>
        {isVisible && (
          <div className="max-w-4xl mt-8 mx-auto">
            <h2 className="font-medium mb-8 text-center text-xl">Trucos</h2>
            {isAdmin && (
              <div className="mb-8 text-center">
                <p className="mb-1">Tirar confetti en la sala</p>
                <Button
                  color={room?.showConfetti ? 'red' : 'green'}
                  onClick={confetti}
                >
                  {room?.showConfetti ? (
                    <FiFrown className="mr-4 text-2xl" />
                  ) : (
                    <FiSmile className="mr-4 text-2xl" />
                  )}
                  {room?.showConfetti ? 'No festejar más' : 'Festejar'}
                </Button>
                {room?.showConfetti && <Confetti />}
              </div>
            )}
            <BackgroundCells />
          </div>
        )}
      </div>
    </BackgroundCellContextProvider>
  )
}
