import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FiFrown, FiSmile } from 'react-icons/fi'
import Modal from 'react-modal'
import BackgroundCells from '~/components/BackgroundCells'
import Banner from '~/components/Banner'
import Boards from '~/components/Boards'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Confetti from '~/components/Confetti'
import LastNumbers from '~/components/LastNumbers'
import Layout from '~/components/Layout'
import Loading from '~/components/Loading'
import Message from '~/components/Message'
import Pato from '~/components/Pato'
import SelectedNumbers from '~/components/SelectedNumbers'
import Sounds from '~/components/Sounds'
import { BackgroundCellContextProvider } from '~/contexts/BackgroundCellContext'
import { EasterEggContextProvider } from '~/contexts/EasterEggContext'
import useRoom from '~/hooks/useRoom'
import { roomsRef } from '~/utils/firebase'
import * as gtag from '~/utils/gtag'

export default function Play() {
  const router = useRouter()
  const roomId = router.query.roomId?.toString()
  const playerId = router.query.playerId?.toString()
  const room = useRoom(roomId)
  const [showModal, setShowModal] = useState(false)
  const { t } = useTranslation()
  /* TODO: can we make a custom hook? */
  const [player, setPlayer] = useState<firebase.firestore.DocumentData>()
  const isAdmin = room?.adminId === playerId

  useEffect(() => {
    if (!playerId || !roomId) return

    const unsubscribe = roomsRef
      .doc(roomId)
      .collection('players')
      .doc(playerId)
      .onSnapshot(doc => {
        doc.exists &&
          setPlayer({
            id: doc.id,
            ...doc.data(),
          })
      })

    return unsubscribe
  }, [playerId, roomId])

  useEffect(() => {
    const timer = setTimeout(() => {
      gtag.event('stay', 'cartones', 'time', { playerId, roomId })
    }, 120000)

    return () => clearTimeout(timer)
  }, [])

  const onNewNumber = (n: number) => {
    if (!room) return

    const selectedNumbers = room.selectedNumbers || []
    let numbers

    if (selectedNumbers.includes(n)) {
      numbers = selectedNumbers.filter((sn: number) => sn !== n)
    } else {
      numbers = [n, ...selectedNumbers]
    }

    roomsRef.doc(roomId).update({
      selectedNumbers: numbers,
    })
  }

  const confetti = () => {
    const roomRef = roomsRef.doc(roomId)
    roomRef.update({ showConfetti: !room?.showConfetti })
  }

  const replay = async () => {
    await roomsRef.doc(roomId).update({ readyToPlay: false })
    Router.pushI18n('/room/[roomId]/admin', `/room/${roomId}/admin`)
  }

  return (
    <Layout>
      {!room || !room.readyToPlay ? (
        <div className="flex justify-center items-center text-center mt-32">
          <div>
            <Loading />
            {room.hasOwnProperty('readyToPlay') && (
              <p className="mt-4">La sala se esta configurando...</p>
            )}
          </div>
        </div>
      ) : (
        <EasterEggContextProvider>
          <BackgroundCellContextProvider>
            <div className="px-4 pt-8 pb-4">
              <h2 className="font-medium text-center text-lg md:text-xl">
                {t('jugar:title', {
                  playerName: player?.name || '',
                  roomName: room.name || '',
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
                      <Box>
                        <h2 className="font-medium mb-4 text-center text-lg md:text-xl">
                          {t('jugar:last-numbers')}
                        </h2>
                        <LastNumbers
                          selectedNumbers={room?.selectedNumbers || []}
                        />
                      </Box>
                      <div className="hidden lg:block mt-8">
                        <Box>
                          <h2 className="font-medium mb-4 text-center text-lg md:text-xl">
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
                        </Box>
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
                            ...newProps,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="lg:hidden mt-8">
                    <Box>
                      <h2 className="font-medium mb-4 text-center text-lg md:text-xl">
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
                    </Box>
                  </div>
                </div>
              </div>
              {isAdmin && (
                <div className="max-w-4xl mt-8 mx-auto">
                  <Box>
                    <Banner>
                      {t('jugar:admin-title')}
                      <span role="img" aria-label="emoji">
                        &nbsp;😎
                      </span>
                    </Banner>
                    <div className="my-8 text-center">
                      <h2 className="font-medium mb-8 text-center text-lg md:text-xl">
                        {t('jugar:celebrate')}
                      </h2>
                      <Button
                        color={room?.showConfetti ? 'red' : 'green'}
                        onClick={confetti}
                      >
                        {room?.showConfetti ? <FiFrown /> : <FiSmile />}
                        <span className="ml-4">
                          {t(
                            `jugar:${
                              room?.showConfetti ? 'hide' : 'show'
                            }-confetti`,
                          )}
                        </span>
                      </Button>
                    </div>
                    <Pato />
                  </Box>
                </div>
              )}
              {room?.showConfetti && <Confetti />}
              <Sounds isAdmin={isAdmin} />
              <div className="max-w-4xl mt-8 mx-auto">
                <Box>
                  <BackgroundCells />
                </Box>
              </div>
            </div>
            {isAdmin && (
              <div className="text-center mb-8">
                <Button className="mt-8" onClick={() => setShowModal(true)}>
                  Reiniciar sala
                </Button>
                <Modal
                  contentLabel="Example Modal"
                  isOpen={showModal}
                  onRequestClose={() => setShowModal(false)}
                  style={{
                    content: {
                      position: 'initial',
                      border: '1px solid rgb(204, 204, 204)',
                      background: 'white',
                      borderRadius: 4,
                      outline: 'none',
                      padding: 20,
                      margin: 8,
                      textAlign: 'center',
                    },
                    overlay: {
                      zIndex: 99,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  }}
                >
                  <p>
                    Esta acción va a reiniciar los valores de la sala para
                    comenzar de nuevo el juego. Estas segurx ?
                  </p>
                  <Button className="mt-8" onClick={replay}>
                    Confirmar
                  </Button>
                </Modal>
              </div>
            )}
          </BackgroundCellContextProvider>
        </EasterEggContextProvider>
      )}
    </Layout>
  )
}
