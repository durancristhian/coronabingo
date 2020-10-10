import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useEffect } from 'react'
import Ads from '~/components/Ads'
import Box from '~/components/Box'
import Confetti from '~/components/Confetti'
import Error from '~/components/Error'
import Heading from '~/components/Heading'
import LastNumbers from '~/components/LastNumbers'
import Layout from '~/components/Layout'
import Loading from '~/components/Loading'
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

export default function RoomPlayer() {
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
        <Loading />
      </Layout>
    )
  }

  if (roomError || playerError) {
    return (
      <Layout>
        <Error />
      </Layout>
    )
  }

  if (!room) {
    return (
      <Layout>
        <Message type="error">{t('common:unexisting-room')}</Message>
      </Layout>
    )
  }

  if (isRoomOld(room)) {
    return (
      <Layout>
        <Message type="error">{t('common:outdated-room')}</Message>
      </Layout>
    )
  }

  if (!room.readyToPlay) {
    return (
      <Layout>
        <Loading message={t('playerId:room-not-ready')} />
      </Layout>
    )
  }

  if (!player) {
    return (
      <Layout>
        <Message type="error">{t('playerId:unexisting-player')}</Message>
      </Layout>
    )
  }

  const isAdmin = room.adminId === player.id

  if (isAdmin && room.activateAdminCode && !loggedIn) {
    return (
      <Layout type="medium">
        <Box>
          <RoomCode roomCode={room.code} />
        </Box>
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
        <Heading textAlign="center" type="h2">
          {t('common:bingo-spinner')}
        </Heading>
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

  const enableStreamerView = room.adminId === player.id && room.streamerView

  return (
    <Layout type="large">
      <Ads />
      <BackgroundCellContextProvider playerId={player.id}>
        <div className="mb-4">
          <Heading textAlign="center" type="h2">
            {t('playerId:title', {
              playerName: player.name,
              roomName: room.name,
            })}
          </Heading>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="lg:flex lg:justify-center mt-4">
            <div
              className={classnames(
                enableStreamerView ? 'lg:w-2/3' : 'lg:w-1/3',
              )}
            >
              <Box>
                <div className="mb-4">
                  <Heading textAlign="center" type="h2">
                    {t('playerId:last-numbers')}
                  </Heading>
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
            {enableStreamerView ? null : (
              <div className="pt-4 lg:pt-0 lg:pl-4 lg:w-2/3">
                <Tickets
                  player={player}
                  room={room}
                  updatePlayer={updatePlayer}
                />
              </div>
            )}
          </div>
          <div className="lg:hidden mt-4">{renderBingoSpinnerAndOptions()}</div>
        </div>
        <Confetti type={room.confettiType} />
        <Sounds isAdmin={isAdmin} room={room} />
      </BackgroundCellContextProvider>
    </Layout>
  )
}
