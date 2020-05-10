import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useEffect } from 'react'
import Tickets from '~/components/Tickets'
import Box from '~/components/Box'
import Confetti from '~/components/Confetti'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import LastNumbers from '~/components/LastNumbers'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import Options from '~/components/Options'
import SelectedNumbers from '~/components/SelectedNumbers'
import Sounds from '~/components/Sounds'
import { BackgroundCellContextProvider } from '~/contexts/BackgroundCellContext'
import { EasterEggContextProvider } from '~/contexts/EasterEggContext'
import usePlayer from '~/hooks/usePlayer'
import useRoom from '~/hooks/useRoom'
import roomApi from '~/models/room'
import scrollToTop from '~/utils/scrollToTop'

export default function Jugar() {
  const { room } = useRoom()
  const { player, updatePlayer } = usePlayer()
  const { t } = useTranslation()

  useEffect(scrollToTop, [])

  if (!room || !player) {
    return (
      <Layout>
        <Container>
          <Message type="information">{t('playerId:loading')}</Message>
        </Container>
      </Layout>
    )
  }

  if (!room.readyToPlay) {
    return (
      <Layout>
        <Container>
          <Message type="information">{t('playerId:room-not-ready')}</Message>
        </Container>
      </Layout>
    )
  }

  if (!player.exists) {
    return (
      <Layout>
        <Container>
          <Message type="error">{t('playerId:out-of-room')}</Message>
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

  const renderBingoSpinnerAndOptions = () => (
    <Fragment>
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
      <div className="mt-4">
        <Options isAdmin={isAdmin} room={room} />
      </div>
    </Fragment>
  )

  return (
    <EasterEggContextProvider>
      <BackgroundCellContextProvider playerId={player.id}>
        <Layout>
          <div className="mb-4">
            <Heading type="h2">
              {t('playerId:title', {
                playerName: player.name,
                roomName: room.name,
              })}
            </Heading>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="lg:flex mt-4">
              <div className="lg:w-1/3">
                <Box>
                  <div className="mb-4">
                    <Heading type="h2">{t('playerId:last-numbers')}</Heading>
                  </div>
                  <LastNumbers selectedNumbers={room.selectedNumbers} />
                </Box>
                <div className="hidden lg:block mt-4">
                  {renderBingoSpinnerAndOptions()}
                </div>
              </div>
              <div className="pt-4 lg:pt-0 lg:pl-4 lg:w-2/3">
                <Tickets player={player} updatePlayer={updatePlayer} />
              </div>
            </div>
            <div className="lg:hidden mt-4">
              {renderBingoSpinnerAndOptions()}
            </div>
          </div>
        </Layout>
        <Confetti type={room.confettiType} />
        <Sounds isAdmin={isAdmin} room={room} />
      </BackgroundCellContextProvider>
    </EasterEggContextProvider>
  )
}
