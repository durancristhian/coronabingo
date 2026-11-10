import Router, { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { FiPlay } from 'react-icons/fi'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Checkbox from '~/components/Checkbox'
import Copy from '~/components/Copy'
import Error from '~/components/Error'
import Heading from '~/components/Heading'
import InputText from '~/components/InputText'
import Layout from '~/components/Layout'
import Loading from '~/components/Loading'
import Message from '~/components/Message'
import Players from '~/components/Players'
import RoomCodeCell from '~/components/RoomCodeCell'
import Select from '~/components/Select'
import useEasterEgg from '~/hooks/useEasterEgg'
import usePlayers from '~/hooks/usePlayers'
import useRandomTickets from '~/hooks/useRandomTickets'
import useRoom from '~/hooks/useRoom'
import useToast from '~/hooks/useToast'
import { Emojis } from '~/interfaces/custom/Emojis'
import playerApi, { defaultPlayerData } from '~/models/player'
import roomApi, { defaultRoomData } from '~/models/room'
import { getRoomStartedEventParams } from '~/utils/analyticsEvents'
import { createBatch } from '~/utils/firebase'
import { getBaseUrl } from '~/utils/getBaseUrl'
import { isRoomOld } from '~/utils/isRoomOld'
import { scrollToTop } from '~/utils/scrollToTop'
import { logEvent as log } from '~/utils/gtag'

export default function RoomAdmin() {
  const { lang, t } = useTranslation()
  const {
    error: playersError,
    loading: playersLoading,
    players,
    setPlayers,
    removePlayer,
  } = usePlayers()
  const { error: roomError, loading: roomLoading, room, updateRoom } = useRoom()
  const randomTickets = useRandomTickets()
  const router = useRouter()
  const activeRoomId = useRef<string | undefined>(undefined)
  activeRoomId.current = router.query.roomId?.toString()
  const mounted = useRef(false)
  const pendingStarts = useRef(new Map<string, symbol>())
  const [pendingRooms, setPendingRooms] = useState(new Set<string>())
  const inProgress = !!room && pendingRooms.has(room.id)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  const playersBusy = useRef(new Set<string>())
  const [playersPendingRooms, setPlayersPendingRooms] = useState(
    new Set<string>(),
  )
  const playersPending = !!room && playersPendingRooms.has(room.id)
  const { createToast, dismissToast, updateToast } = useToast()
  const { isActive, incrementInteractions } = useEasterEgg('useRoomExperiments')

  useEffect(scrollToTop, [])

  if (roomLoading || playersLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  if (roomError || playersError) {
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

  if (room.locked) {
    return (
      <Layout>
        <Message type="error">{t('common:locked-room')}</Message>
      </Layout>
    )
  }

  const submitRoom = async () => {
    if (
      activeRoomId.current !== room.id ||
      pendingStarts.current.has(room.id) ||
      playersBusy.current.has(room.id)
    )
      return

    const operation = Symbol(room.id)
    pendingStarts.current.set(room.id, operation)
    setPendingRooms(new Set(pendingStarts.current.keys()))
    const ownsCompletion = () =>
      mounted.current &&
      activeRoomId.current === room.id &&
      pendingStarts.current.get(room.id) === operation

    const toastId = createToast('admin:saving', 'information')

    try {
      const batch = createBatch()

      batch.update(room.ref, {
        ...defaultRoomData,
        ...roomApi.excludeExtraFields(room),
        readyToPlay: true,
        selectedNumbers: [],
        soundToPlay: '',
        soundCommandId: '',
        confettiType: '',
      })

      players.map((player, index) => {
        batch.set(player.ref, {
          ...defaultPlayerData,
          ...playerApi.excludeExtraFields(player),
          /* TODO: review this case after improving the one with the room above */
          tickets: randomTickets[index],
          selectedNumbers: [],
        })
      })

      await batch.commit()

      if (!ownsCompletion()) {
        dismissToast(toastId)
        return
      }

      log(
        'room_started',
        getRoomStartedEventParams({
          createdAt: room.date.toDate(),
          hideNumbersMeaning: room.hideNumbersMeaning,
          language: lang,
          playNumber: room.timesPlayed,
          playerCount: players.length,
          usesOnlineSpinner: room.bingoSpinner,
        }),
      )

      updateToast('admin:success', 'success', toastId)

      setTimeout(() => {
        dismissToast(toastId)
      }, 2000)

      Router.push('/room/[roomId]', `/room/${room.id}`)
    } catch (e) {
      if (!ownsCompletion()) {
        dismissToast(toastId)
        return
      }
      updateToast('admin:error', 'error', toastId)
    } finally {
      // Settle only this room's operation, even after navigation or a revisit.
      if (pendingStarts.current.get(room.id) === operation) {
        pendingStarts.current.delete(room.id)
        if (mounted.current) {
          setPendingRooms(new Set(pendingStarts.current.keys()))
        }
      }
    }
  }

  return (
    <Layout>
      <Box>
        <div className="mb-4">
          <Heading textAlign="center" type="h2">
            <span
              id="room-title"
              onClick={incrementInteractions}
              role="button"
              tabIndex={0}
              onKeyPress={incrementInteractions}
              className="cursor-text focus:outline-none outline-none"
            >
              {t('admin:title')}
            </span>
          </Heading>
        </div>
        <Fragment>
          <InputText
            id="room-name"
            label={t('admin:field-name')}
            value={room.name}
            readonly
            onFocus={event => event.target.select()}
          />
          <InputText
            hint={t('admin:field-link-hint')}
            id="url"
            label={t('admin:field-link')}
            value={`${getBaseUrl()}/room/${room.id}`}
            readonly
            onFocus={event => event.target.select()}
          />
          <Copy content={`${getBaseUrl()}/room/${room.id}`} />
          <Players
            key={room.id}
            isFormDisabled={inProgress || playersPending}
            onPendingChange={pending => {
              if (pending) playersBusy.current.add(room.id)
              else playersBusy.current.delete(room.id)
              setPlayersPendingRooms(new Set(playersBusy.current))
            }}
            players={players}
            room={room}
            setPlayers={setPlayers}
            removePlayer={removePlayer}
            updateRoom={updateRoom}
          />
          <div className="mt-4">
            <Select
              disabled={!players.length || inProgress || playersPending}
              hint={t('admin:players.field-admin-hint')}
              id="adminId"
              label={t('admin:players.field-admin')}
              onChange={value => updateRoom({ adminId: value })}
              options={players}
              value={room.adminId}
            />
          </div>
          <div className="mt-4">
            <Checkbox
              hint={t('admin:field-bingo-spinner-hint')}
              id="bingo-spinner"
              label={t('admin:field-bingo-spinner')}
              onChange={value => {
                updateRoom({ bingoSpinner: value })
              }}
              value={room.bingoSpinner}
              disabled={inProgress || playersPending}
            />
          </div>
          <div className="mt-4">
            <Checkbox
              hint={t('admin:field-hide-dreams-hint')}
              id="hide-numbers-meaning"
              label={t('admin:field-hide-dreams')}
              onChange={value => {
                updateRoom({ hideNumbersMeaning: value })
              }}
              value={room.hideNumbersMeaning}
              disabled={inProgress || playersPending}
            />
          </div>
          {isActive && (
            <Fragment>
              <div className="mt-4">
                <Checkbox
                  hint={t('admin:field-admin-code-hint')}
                  id="activate-admin-code"
                  label={t('admin:field-admin-code')}
                  onChange={value => {
                    updateRoom({ activateAdminCode: value })
                  }}
                  value={room.activateAdminCode}
                  disabled={inProgress || playersPending}
                />
              </div>
              {room.activateAdminCode && (
                <div className="mt-4">
                  <p>{t('admin:room-code')}</p>
                  <div className="flex flex-wrap justify-between mt-1">
                    {room.code.split(',').map((emoji, index) => {
                      return (
                        <RoomCodeCell
                          highlighted
                          emoji={emoji as keyof Emojis}
                          index={index}
                          isChecked={false}
                          key={index}
                          onClick={() => void 0}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
            </Fragment>
          )}
          <div className="mt-8">
            <Button
              aria-label={t('admin:field-submit')}
              color="green"
              id="configure-room"
              className="w-full"
              disabled={
                !room.adminId ||
                players.length < 2 ||
                inProgress ||
                playersPending
              }
              onClick={submitRoom}
              iconLeft={<FiPlay />}
            >
              {t('admin:field-submit')}
            </Button>
          </div>
        </Fragment>
      </Box>
    </Layout>
  )
}
