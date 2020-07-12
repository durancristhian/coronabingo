import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useEffect, useState } from 'react'
import { FiSmile } from 'react-icons/fi'
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
import { Emojis } from '~/interfaces'
import playerApi, { defaultPlayerData } from '~/models/player'
import roomApi, { defaultRoomData } from '~/models/room'
import { createBatch, getBaseUrl, isRoomOld, scrollToTop } from '~/utils'

export default function RoomAdmin() {
  const { t } = useTranslation()
  const {
    error: playersError,
    loading: playersLoading,
    players,
    setPlayers,
  } = usePlayers()
  const { error: roomError, loading: roomLoading, room, updateRoom } = useRoom()
  const randomTickets = useRandomTickets()
  const [inProgress, setInProgress] = useState(false)
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
    setInProgress(true)

    const toastId = createToast('admin:saving', 'information')

    try {
      const batch = createBatch()

      batch.update(room.ref, {
        ...defaultRoomData,
        ...roomApi.excludeExtraFields(room),
        readyToPlay: true,
        selectedNumbers: [],
        soundToPlay: '',
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

      updateToast('admin:success', 'success', toastId)

      setTimeout(() => {
        dismissToast(toastId)
      }, 2000)

      Router.pushI18n('/room/[roomId]', `/room/${room.id}`)
    } catch (e) {
      updateToast('admin:error', 'error', toastId)

      setInProgress(false)
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
            isFormDisabled={inProgress}
            players={players}
            room={room}
            setPlayers={setPlayers}
            updateRoom={updateRoom}
          />
          <div className="mt-4">
            <Select
              disabled={!players.length || inProgress}
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
              disabled={inProgress}
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
              disabled={inProgress}
            />
          </div>
          {isActive && (
            <Fragment>
              <div className="mt-4">
                <Checkbox
                  hint="Pedir el código de sala al ingresar a los cartones de quien dirige la sala"
                  id="activate-admin-code"
                  label="Activar código para el admin"
                  onChange={value => {
                    updateRoom({ activateAdminCode: value })
                  }}
                  value={room.activateAdminCode}
                  disabled={inProgress}
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
              disabled={!room.adminId || players.length < 2 || inProgress}
              onClick={submitRoom}
              iconLeft={<FiSmile />}
            >
              {t('admin:field-submit')}
            </Button>
          </div>
        </Fragment>
      </Box>
    </Layout>
  )
}
