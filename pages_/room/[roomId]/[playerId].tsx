import useTranslation from 'next-translate/useTranslation'
import React, { useEffect, useState } from 'react'
import BackgroundCells from '~/components/BackgroundCells'
import Banner from '~/components/Banner'
import Boards from '~/components/Boards'
import Box from '~/components/Box'
import Celebrations from '~/components/Celebrations'
import Confetti, { ConfettiType } from '~/components/Confetti'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import LastNumbers from '~/components/LastNumbers'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import Pato from '~/components/Pato'
import Restart from '~/components/Restart'
import SelectedNumbers from '~/components/SelectedNumbers'
import Sounds from '~/components/Sounds'
import { BackgroundCellContextProvider } from '~/contexts/BackgroundCellContext'
import { EasterEggContextProvider } from '~/contexts/EasterEggContext'
import usePlayer from '~/hooks/usePlayer'
import useRoom from '~/hooks/useRoom'
import scrollToTop from '~/utils/scrollToTop'

export default function Jugar() {
  const { room } = useRoom()
  const { player, setPlayer } = usePlayer()
  const { t } = useTranslation()
  const [activeSound, setActiveSound] = useState('')

  useEffect(scrollToTop, [])

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

  const onConfettiChange = (confettiType: ConfettiType | '') => {
    room?.ref.update({ confettiType })
  }

  const setSoundToPlay = (soundToPlay = '') => {
    isAdmin && room?.ref.update({ soundToPlay })
  }

  if (!room) {
    return (
      <Layout>
        <Container>
          <Message type="information">{t('jugar:loading')}</Message>
        </Container>
      </Layout>
    )
  }

  if (room && !room.readyToPlay) {
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
      <BackgroundCellContextProvider playerId={player.id}>
        <Layout>
          <Heading type="h2">
            {t('jugar:title', {
              playerName: player?.name || '',
              roomName: room.name || '',
            })}
          </Heading>
          <div className="max-w-6xl mx-auto">
            <div className="lg:flex mt-4">
              {room && (
                <div className="lg:w-1/3">
                  <Box>
                    <Heading type="h2">{t('jugar:last-numbers')}</Heading>
                    <LastNumbers selectedNumbers={room.selectedNumbers || []} />
                  </Box>
                  <div className="hidden lg:block mt-4">
                    <Box>
                      <Heading type="h2">{t('common:bingo-spinner')}</Heading>
                      <div className="mt-4">
                        <SelectedNumbers
                          isAdmin={isAdmin}
                          onNewNumber={onNewNumber}
                          selectedNumbers={room.selectedNumbers || []}
                          bingoSpinner={room.bingoSpinner}
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
                <Heading type="h2">{t('common:bingo-spinner')}</Heading>
                <div className="mt-4">
                  <SelectedNumbers
                    isAdmin={isAdmin}
                    onNewNumber={onNewNumber}
                    selectedNumbers={room.selectedNumbers || []}
                    bingoSpinner={room.bingoSpinner}
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
                    <span className="mr-1">{t('jugar:admin-title')}</span>
                    <i
                      className="em em-sunglasses"
                      tabIndex={-1}
                      aria-label="Smiling face with sunglasses"
                    ></i>
                  </Banner>
                  <div className="mt-8">
                    <Restart />
                  </div>
                  <div className="mt-8">
                    <Celebrations
                      confettiType={room.confettiType}
                      onConfettiChange={onConfettiChange}
                    />
                  </div>
                  <div className="mt-8">
                    <Pato
                      activeSound={activeSound}
                      onClick={sound => {
                        setSoundToPlay(sound)
                        setActiveSound(sound)
                      }}
                    />
                  </div>
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
        <Confetti type={room.confettiType} />
        <Sounds
          onAudioPlayed={setSoundToPlay}
          onAudioEnd={() => setActiveSound('')}
          soundToPlay={room.soundToPlay}
        />
      </BackgroundCellContextProvider>
    </EasterEggContextProvider>
  )
}
