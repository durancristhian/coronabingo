import useTranslation from 'next-translate/useTranslation'
import React, { useEffect } from 'react'
import AdminOptions from '~/components/AdminOptions'
import Banner from '~/components/Banner'
import Boards from '~/components/Boards'
import Box from '~/components/Box'
import Confetti from '~/components/Confetti'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import LastNumbers from '~/components/LastNumbers'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import SelectedNumbers from '~/components/SelectedNumbers'
import Sounds from '~/components/Sounds'
import UserOptions from '~/components/UserOptions'
import { BackgroundCellContextProvider } from '~/contexts/BackgroundCellContext'
import { EasterEggContextProvider } from '~/contexts/EasterEggContext'
import usePlayer from '~/hooks/usePlayer'
import useRoom from '~/hooks/useRoom'
import roomApi from '~/models/room'
import scrollToTop from '~/utils/scrollToTop'

export default function Jugar() {
  const { room } = useRoom()
  const { player, setPlayer } = usePlayer()
  const { t } = useTranslation()

  useEffect(scrollToTop, [])

  if (!room || !player) {
    return (
      <Layout>
        <Container>
          <Message type="information">{t('jugar:loading')}</Message>
        </Container>
      </Layout>
    )
  }

  if (!room.readyToPlay) {
    return (
      <Layout>
        <Container>
          <Message type="information">{t('jugar:room-not-ready')}</Message>
        </Container>
      </Layout>
    )
  }

  if (!player.exists) {
    return (
      <Layout>
        <Container>
          <Message type="error">{t('jugar:out-of-room')}</Message>
        </Container>
      </Layout>
    )
  }

  const isAdmin = room.adminId === player.id

  const onNewNumber = (n: number) => {
    const selectedNumbers = room.selectedNumbers || []
    let numbers

    if (selectedNumbers.includes(n)) {
      numbers = selectedNumbers.filter((sn: number) => sn !== n)
    } else {
      numbers = [n, ...selectedNumbers]
    }

    roomApi.updateRoom(room.ref, {
      selectedNumbers: numbers,
    })
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
                    <div className="mt-4">
                      <UserOptions />
                    </div>
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
            <div className="mt-4">
              <Container>
                <Box>
                  <Banner>
                    <span className="mr-1">{t('jugar:admin-title')}</span>
                    <i
                      className="em em-sunglasses"
                      tabIndex={-1}
                      aria-label="Smiling face with sunglasses"
                    ></i>
                  </Banner>
                  <div className="mt-4">
                    <AdminOptions room={room} />
                  </div>
                </Box>
              </Container>
            </div>
          )}
        </Layout>
        <Confetti type={room.confettiType} />
        <Sounds isAdmin={isAdmin} room={room} />
      </BackgroundCellContextProvider>
    </EasterEggContextProvider>
  )
}
