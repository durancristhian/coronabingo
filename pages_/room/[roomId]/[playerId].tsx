import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import { FiFrown, FiSmile } from 'react-icons/fi'
import BackgroundCells from '~/components/BackgroundCells'
import Banner from '~/components/Banner'
import Boards from '~/components/Boards'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Confetti from '~/components/Confetti'
import Container from '~/components/Container'
import LastNumbers from '~/components/LastNumbers'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import Pato from '~/components/Pato'
import Restart from '~/components/Restart'
import SelectedNumbers from '~/components/SelectedNumbers'
import Sounds from '~/components/Sounds'
import { BackgroundCellContextProvider } from '~/contexts/BackgroundCellContext'
import { EasterEggContextProvider } from '~/contexts/EasterEggContext'
import useRoom from '~/hooks/useRoom'
import useRoomPlayers from '~/hooks/useRoomPlayers'

export default function Jugar() {
  const [room] = useRoom()
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

    room.ref.update({
      selectedNumbers: numbers,
    })
  }

  const confetti = () => {
    room.ref.update({ showConfetti: !room.showConfetti })
  }

  const setSoundToPlay = (soundToPlay = '') =>
    isAdmin && room.ref.update({ soundToPlay })

  if (!room.id) {
    return (
      <Layout>
        <Container>
          <Message type="information">{t('jugar:loading')}</Message>
        </Container>
      </Layout>
    )
  }

  if (room.id && !room.readyToPlay) {
    return (
      <Layout>
        <Container>
          <Message type="information">{t('jugar:room-not-ready')}</Message>
        </Container>
      </Layout>
    )
  }

  if (!player) {
    return (
      <Layout>
        <Container>
          <Message type="information">{t('jugar:out-of-room')}</Message>
        </Container>
      </Layout>
    )
  }

  return (
    <EasterEggContextProvider>
      <BackgroundCellContextProvider>
        <Layout>
          <h2 className="font-medium text-center text-lg md:text-xl">
            {t('jugar:title', {
              playerName: player?.name || '',
              roomName: room.name || '',
            })}
          </h2>
          <div className="max-w-6xl mx-auto">
            <div className="lg:flex mt-4">
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
                  <div className="hidden lg:block mt-4">
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
                  <div className="lg:flex lg:flex-col lg:justify-between lg:h-full">
                    <Boards
                      player={player}
                      room={room}
                      setPlayerProps={newProps =>
                        setPlayer({
                          ...player,
                          ...newProps,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="lg:hidden mt-4">
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
          {isAdmin && (
            <div className="mt-8">
              <Container size="large">
                <Box>
                  <Banner>
                    {t('jugar:admin-title')}
                    <span role="img" aria-label="sunglasses">
                      &nbsp;😎
                    </span>
                  </Banner>
                  <div className="flex flex-col md:flex-row items-center justify-center my-8">
                    <div className="mb-4 md:mb-0 mr-4">
                      <Restart />
                    </div>
                    <div className="mr-4 md:mr-0">
                      <Button
                        color={room.showConfetti ? 'red' : 'green'}
                        onClick={confetti}
                      >
                        {room.showConfetti ? (
                          <Fragment>
                            <FiFrown />
                            <span className="ml-4">
                              {t('jugar:hide-confetti')}
                            </span>
                          </Fragment>
                        ) : (
                          <Fragment>
                            <FiSmile />
                            <span className="ml-4">
                              {t('jugar:show-confetti')}
                            </span>
                          </Fragment>
                        )}
                      </Button>
                    </div>
                  </div>
                  <Pato
                    disabled={room.soundToPlay}
                    onClick={setSoundToPlay}
                    soundToPlay={room.soundToPlay}
                  />
                </Box>
              </Container>
            </div>
          )}
          <div className="mt-8">
            <Container size="large">
              <Box>
                <BackgroundCells />
              </Box>
            </Container>
          </div>
        </Layout>
        <Confetti enabled={room.showConfetti} />
        <Sounds onAudioEnd={setSoundToPlay} soundToPlay={room.soundToPlay} />
      </BackgroundCellContextProvider>
    </EasterEggContextProvider>
  )
}
