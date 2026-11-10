import classnames from 'classnames'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useEffect, useState } from 'react'
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
import usePendingOperation from '~/hooks/usePendingOperation'
import usePlayer from '~/hooks/usePlayer'
import useRoom from '~/hooks/useRoom'
import useRoomCode from '~/hooks/useRoomCode'
import roomApi from '~/models/room'
import { isRoomOld } from '~/utils/isRoomOld'
import { scrollToTop } from '~/utils/scrollToTop'

export default function RoomPlayer() {
  const { error: roomError, loading: roomLoading, room } = useRoom()
  const { error: playerError, loading: playerLoading, player } = usePlayer()
  const { t } = useTranslation()
  const { loggedIn } = useRoomCode()
  const [drawError, setDrawError] = useState(false)
  const { pending: drawPending, run: runDraw } = usePendingOperation()

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

  if (!player) {
    return (
      <Layout>
        <Message type="error">
          <div>
            <p>{t('playerId:unexisting-player')}</p>
            <Link
              href={`/room/${room.id}`}
              className="cb-text-link inline-block mt-2 font-medium text-blue-800 underline focus:outline-none focus:shadow-outline"
            >
              {t('playerId:back-to-room')}
            </Link>
          </div>
        </Message>
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

  const onNewNumber = (number?: number) => {
    void runDraw(async () => {
      setDrawError(false)
      try {
        await roomApi.changeCalledNumber(room, number)
      } catch {
        setDrawError(true)
      }
    })
  }

  const renderBingoSpinnerAndOptions = () => (
    <Fragment>
      <Box>
        <Heading textAlign="center" type="h2">
          {t('common:bingo-spinner')}
        </Heading>
        <div className="mt-4">
          {drawError && (
            <div role="alert">
              <Message type="error">{t('playerId:draw-error')}</Message>
            </div>
          )}
          <SelectedNumbers
            pending={drawPending}
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
      <BackgroundCellContextProvider
        playNumber={room.timesPlayed}
        playerId={player.id}
        roomId={room.id}
        trackCardOpened={!enableStreamerView}
      >
        <div className="cb-game-title mb-4">
          <Heading textAlign="center" type="h2">
            {t('playerId:title', {
              playerName: player.name,
              roomName: room.name,
            })}
          </Heading>
        </div>
        <div
          className={classnames('cb-game-table max-w-6xl mx-auto', {
            'cb-game-table--streamer': enableStreamerView,
          })}
        >
          <div className="cb-game-last-numbers">
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
          </div>
          {enableStreamerView ? null : (
            <div className="cb-game-cards">
              <Tickets player={player} />
            </div>
          )}
          <div className="cb-game-controls">
            {renderBingoSpinnerAndOptions()}
          </div>
        </div>
        <Confetti type={room.confettiType} />
        <Sounds isAdmin={isAdmin} room={room} />
      </BackgroundCellContextProvider>
    </Layout>
  )
}
