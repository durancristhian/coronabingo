import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useEffect } from 'react'
import Box from '~/components/Box'
import Confetti from '~/components/Confetti'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import LastNumbers from '~/components/LastNumbers'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import Options from '~/components/Options'
import RoomCode from '~/components/RoomCode'
import SelectedNumbers from '~/components/SelectedNumbers'
import Sounds from '~/components/Sounds'
import Tickets from '~/components/Tickets'
import { BackgroundCellContextProvider } from '~/contexts/BackgroundCell'
import usePlayer from '~/hooks/usePlayer'
import useRoom from '~/hooks/useRoom'
import useRoomCode from '~/hooks/useRoomCode'
import roomApi from '~/models/room'
import { isRoomOld, scrollToTop } from '~/utils'

export default function Jugar() {
  const { error: roomError, loading: roomLoading, room } = useRoom()
  const {
    error: playerError,
    loading: playerLoading,
    player,
    updatePlayer,
  } = usePlayer()
  const { t } = useTranslation()
  const { loggedIn } = useRoomCode()

  useEffect(scrollToTop, [])

  if (roomLoading || playerLoading) {
    return (
      <Layout>
        <Container>
          <Message type="information">{t('common:loading-room')}</Message>
        </Container>
      </Layout>
    )
  }

  if (roomError || playerError) {
    return (
      <Layout>
        <Container>
          <Message type="error">{t('common:error-room')}</Message>
        </Container>
      </Layout>
    )
  }

  if (!room || !player) return null

  if (isRoomOld(room)) {
    return (
      <Layout>
        <Container>
          <Message type="error">{t('common:outdated-room')}</Message>
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

  if (isAdmin && room.activateAdminCode && !loggedIn) {
    return (
      <Layout>
        <Container>
          <Box>
            <RoomCode roomCode={room.code} />
          </Box>
        </Container>
      </Layout>
    )
  }

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
                <LastNumbers
                  hideNumbersMeaning={room.hideNumbersMeaning}
                  selectedNumbers={room.selectedNumbers}
                />
              </Box>
              <div className="hidden lg:block mt-4">
                {renderBingoSpinnerAndOptions()}
              </div>
            </div>
            <div className="pt-4 lg:pt-0 lg:pl-4 lg:w-2/3">
              <Tickets
                player={player}
                room={room}
                updatePlayer={updatePlayer}
              />
            </div>
          </div>
          <div className="lg:hidden mt-4">{renderBingoSpinnerAndOptions()}</div>
        </div>
      </Layout>
      <Confetti type={room.confettiType} />
      <Sounds isAdmin={isAdmin} room={room} />
    </BackgroundCellContextProvider>
  )
}
