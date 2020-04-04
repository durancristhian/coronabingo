import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiFrown, FiSmile } from 'react-icons/fi'
// @ts-ignore
import useTranslation from 'next-translate/useTranslation'
import BackgroundCells from '~/components/BackgroundCells'
import Banner from '~/components/Banner'
import Boards from '~/components/Boards'
import Button from '~/components/Button'
import Confetti from '~/components/Confetti'
import LastNumbers from '~/components/LastNumbers'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import Pato from '~/components/Pato'
import SelectedNumbers from '~/components/SelectedNumbers'
import Sounds from '~/components/Sounds'
import { BackgroundCellContextProvider } from '~/contexts/BackgroundCellContext'
import useRoom from '~/hooks/useRoom'
import { roomsRef } from '~/utils/firebase'

export default function Jugar() {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const playerId = router.query.jugador?.toString()
  const room = useRoom(roomName)
  const { t } = useTranslation()
  /* TODO: can we make a custom hook? */
  const [player, setPlayer] = useState<firebase.firestore.DocumentData>()
  const isAdmin = room?.adminId === playerId

  useEffect(() => {
    if (!playerId || !roomName) return

    const unsubscribe = roomsRef
      .doc(roomName)
      .collection('players')
      .doc(playerId)
      .onSnapshot(doc =>
        setPlayer({
          id: doc.id,
          ...doc.data()
        })
      )

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
    roomRef.update({ showConfetti: !room?.showConfetti })
  }

  return (
    <Layout>
      <BackgroundCellContextProvider>
        <div className="px-4 py-8">
          <h2 className="font-medium text-center text-xl">
            {t('jugar:title', {
              playerName: player?.name || '',
              roomName: roomName || ''
            })}
          </h2>
          {!room?.name && (
            <div className="max-w-4xl mx-auto">
              <div className="md:w-2/4 mx-auto">
                <Message type="information">{t('jugar:loading')}</Message>
              </div>
            </div>
          )}
          <div className="max-w-6xl mx-auto">
            <div className="lg:flex mt-8">
              {room && (
                <div className="lg:w-1/3">
                  <div className="bg-white px-4 py-8 rounded shadow">
                    <h2 className="font-medium mb-4 text-center text-xl">
                      {t('jugar:last-numbers')}
                    </h2>
                    <LastNumbers
                      selectedNumbers={room?.selectedNumbers || []}
                    />
                  </div>
                  <div className="hidden lg:block mt-8">
                    <div className="bg-white px-4 py-8 rounded shadow">
                      <h2 className="font-medium mb-4 text-center text-xl">
                        {t('common:turning-globe')}
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
                    {t('common:turning-globe')}
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
          {isAdmin && (
            <div className="max-w-4xl mt-8 mx-auto">
              <div className="bg-white p-4 rounded shadow">
                <Banner>{t('jugar:admin-title')} 😎</Banner>
                <div className="my-8 text-center">
                  <h2 className="font-medium mb-8 text-center text-xl">
                    {t('jugar:celebrate')}
                  </h2>
                  <Button
                    color={room?.showConfetti ? 'red' : 'green'}
                    onClick={confetti}
                  >
                    {room?.showConfetti ? <FiFrown /> : <FiSmile />}
                    <span className="ml-4">
                      {t(
                        `jugar:${room?.showConfetti ? 'hide' : 'show'}-confetti`
                      )}
                    </span>
                  </Button>
                </div>
                <Pato />
              </div>
            </div>
          )}
          {room?.showConfetti && <Confetti />}
          <Sounds isAdmin={isAdmin} />
          <div className="max-w-4xl mt-8 mx-auto">
            <div className="bg-white p-4 rounded shadow">
              <BackgroundCells />
            </div>
          </div>
        </div>
      </BackgroundCellContextProvider>
    </Layout>
  )
}
