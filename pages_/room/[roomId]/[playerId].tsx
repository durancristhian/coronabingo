import useTranslation from 'next-translate/useTranslation'
import { FiFrown, FiSmile } from 'react-icons/fi'
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
import { EasterEggContextProvider } from '~/contexts/EasterEggContext'
import useRoom from '~/hooks/useRoom'
import { roomsRef } from '~/utils/firebase'
import useRoomPlayers from '~/hooks/useRoomPlayers'
import Box from '~/components/Box'

export default function Jugar() {
  const room = useRoom()
  const { player, setPlayer } = useRoomPlayers()
  const { t } = useTranslation()

  const isAdmin = room?.adminId === player?.id

  const onNewNumber = (n: number) => {
    if (!room) return

    const selectedNumbers = room.selectedNumbers || []
    let numbers

    if (selectedNumbers.includes(n)) {
      numbers = selectedNumbers.filter((sn: number) => sn !== n)
    } else {
      numbers = [n, ...selectedNumbers]
    }

    roomsRef.doc(room.id).update({
      selectedNumbers: numbers
    })
  }

  const confetti = () => {
    roomsRef.doc(room.id).update({ showConfetti: !room.showConfetti })
  }

  const setSoundToPlay = (soundToPlay: string = '') =>
    isAdmin && roomsRef.doc(room.id).update({ soundToPlay })

  return (
    <Layout>
      <EasterEggContextProvider>
        <BackgroundCellContextProvider>
          <div className="px-4 py-8">
            <h2 className="font-medium text-center text-lg md:text-xl">
              {t('jugar:title', {
                playerName: player?.name || '',
                roomName: room.name || ''
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
                      room={room}
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
                  <Banner>{t('jugar:admin-title')} 😎</Banner>
                  <div className="my-8 text-center">
                    <h2 className="font-medium mb-8 text-center text-lg md:text-xl">
                      {t('jugar:celebrate')}
                    </h2>
                    <Button
                      color={room.showConfetti ? 'red' : 'green'}
                      onClick={confetti}
                    >
                      {room.showConfetti ? <FiFrown /> : <FiSmile />}
                      <span className="ml-4">
                        {t(
                          `jugar:${
                            room?.showConfetti ? 'hide' : 'show'
                          }-confetti`
                        )}
                      </span>
                    </Button>
                  </div>
                  <Pato onClick={setSoundToPlay} />
                </Box>
              </div>
            )}
            {room.showConfetti && <Confetti />}
            <Sounds
              onAudioEnd={setSoundToPlay}
              soundToPlay={room.soundToPlay}
            />
            <div className="max-w-4xl mt-8 mx-auto">
              <Box>
                <BackgroundCells />
              </Box>
            </div>
          </div>
        </BackgroundCellContextProvider>
      </EasterEggContextProvider>
    </Layout>
  )
}
