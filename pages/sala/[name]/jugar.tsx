import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import firebase from 'firebase'
import BackgroundCells from '~/components/BackgroundCells'
import Boards from '~/components/Boards'
import Button from '~/components/Button'
import CreateRoom from '~/components/CreateRoom'
import Confetti from '~/components/Confetti'
import Message from '~/components/Message'
import SelectedNumbers from '~/components/SelectedNumbers'
import TurningGlob from '~/components/TurningGlob'
import { BackgroundCellContextProvider } from '~/contexts/BackgroundCellContext'
import useRoom from '~/hooks/useRoom'
import db, { roomsRef } from '~/utils/firebase'
import Drawer from '~/components/Drawer'

export default function Jugar() {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const playerId = router.query.jugador?.toString()
  const room = useRoom(roomName)
  /* TODO: can we make a custom hook? */
  const [player, setPlayer] = useState<firebase.firestore.DocumentData>()
  const [showExperiments, setShowExperiments] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const isAdmin = room?.adminId === player?.name

  useEffect(() => {
    if (!isAdmin) return

    const configureExperiments = async () => {
      const Mousetrap = (await import('mousetrap')).default

      Mousetrap.bind('e x p e r i m e n t o s', () => {
        setShowExperiments(true)
      })
    }

    configureExperiments()
  }, [isAdmin])

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

  const gameOver = () => {
    const roomRef = roomsRef.doc(roomName)
    roomRef.update({ isGameOver: true })
  }

  const duplicateRoom = async (newName: string) => {
    const players = (
      await roomsRef
        .doc(roomName)
        .collection('players')
        .get()
    ).docs
    let batch = db.batch()

    players.map(player => {
      const { name } = player.data()
      batch.set(
        roomsRef
          .doc(newName)
          .collection('players')
          .doc(player.id),
        {
          boards: '',
          name,
          selectedNumbers: []
        }
      )
    })

    await batch.commit()
  }

  return !room?.isGameOver ? (
    <BackgroundCellContextProvider>
      <div className="px-4 py-8">
        <button
          className="absolute top-0 mt-4"
          onClick={() => setOpenDrawer(true)}
        >
          <FiMenu className="text-2xl" />
        </button>
        <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
          <div>
            <h1 className="text-xl font-bold pt-5 mb-4">Tema</h1>
            <BackgroundCells />
            <Button className="mt-4" onClick={gameOver}>
              Terminar juego
            </Button>
            <Button className="mt-4">Otra opción</Button>
          </div>
        </Drawer>
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
          </div>
        </div>
        {showExperiments && (
          <div className="max-w-4xl mt-8 mx-auto">
            <h2 className="font-medium text-center text-xl">Experimentos</h2>
            <div className="my-8">
              <p className="mb-1">Tirar confetti</p>
              <Button
                onClick={confetti}
                color={room?.showConfetti ? 'red' : 'green'}
              >
                {room?.showConfetti ? 'No festejar más' : 'Festejar'}
              </Button>
            </div>
            {room?.showConfetti && <Confetti />}
          </div>
        )}
      </div>
    </BackgroundCellContextProvider>
  ) : (
    <div className="text-center pt-16">
      <h2 className="text-2xl mb-4">¡Este juego terminó!</h2>
      {isAdmin && (
        <div className="bg-white md:w-2/4 mx-auto px-4 py-8 rounded shadow text-left">
          <CreateRoom
            title="Podés crear una sala nueva a partir de esta:"
            onRoomCreated={duplicateRoom}
          />
        </div>
      )}
    </div>
  )
}
