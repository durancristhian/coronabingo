import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useEffect, useState } from 'react'
import { FiSmile } from 'react-icons/fi'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Checkbox from '~/components/Checkbox'
import Container from '~/components/Container'
import Copy from '~/components/Copy'
import Heading from '~/components/Heading'
import InputText from '~/components/InputText'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import Players from '~/components/Players'
import useRandomBoards from '~/hooks/useRandomBoards'
import useRoom from '~/hooks/useRoom'
import useRoomPlayers from '~/hooks/useRoomPlayers'
import { MessageType, Room } from '~/interfaces'
import roomApi, { defaultRoomData } from '~/models/room'
import { createBatch } from '~/utils/firebase'
import scrollToTop from '~/utils/scrollToTop'

export default function Admin() {
  const { t, lang } = useTranslation()
  const [message, setMessage] = useState<{
    content: string
    type: MessageType
    visible: boolean
  }>({
    content: '',
    type: 'information',
    visible: false,
  })
  const { players = [], setPlayers } = useRoomPlayers()
  const { room, updateRoom } = useRoom()
  const randomBoards = useRandomBoards()

  useEffect(scrollToTop, [])

  if (!room) {
    return (
      <Layout>
        <Container>
          <Message type="information">{t('admin:loading')}</Message>
        </Container>
      </Layout>
    )
  }

  const removePlayer = (playerRef: firebase.firestore.DocumentReference) => {
    playerRef.delete()
  }

  const readyToPlay = async (room: Room) => {
    setMessage({
      content: t('admin:success'),
      type: 'success',
      visible: true,
    })

    const batch = createBatch()

    batch.update(room.ref, {
      ...defaultRoomData,
      ...roomApi.excludeExtraFields(room),
      /* HOTFIX */
      selectedNumbers: [],
      readyToPlay: true,
    })

    /* TODO: Refactor this to something like 👆🏼 */
    players.map((player, index) => {
      const { name, ref: playerRef } = player

      batch.set(playerRef, {
        name,
        boards: randomBoards[index],
        selectedNumbers: [],
      })
    })

    await batch.commit()

    setTimeout(() => {
      Router.pushI18n('/room/[roomId]', `/room/${room.id}`)
    }, 1000)
  }

  return (
    <Layout>
      <Container>
        <Box>
          <Heading type="h2">{t('admin:title')}</Heading>
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
              value={`${window.location.host}/${lang}/room/${room.id}`}
              readonly
              onFocus={event => event.target.select()}
            />
            <Copy content={`${window.location.host}/${lang}/room/${room.id}`} />
            <InputText
              id="videoCall"
              label={t('admin:field-videocall')}
              onChange={value => updateRoom({ videoCall: value })}
              value={room.videoCall}
            />
            <Players
              players={players}
              setPlayers={setPlayers}
              removePlayer={removePlayer}
              room={room}
              updateRoom={updateRoom}
            />
            <div className="mt-4">
              <Checkbox
                hint={t('admin:field-bingo-spinner-hint')}
                id="bingoSpinner"
                label={t('admin:field-bingo-spinner')}
                onChange={value => {
                  updateRoom({ bingoSpinner: value })
                }}
                value={room.bingoSpinner}
              />
            </div>
            <div className="mt-8">
              <Button
                color="green"
                id="configure-room"
                className="w-full"
                disabled={!room.adminId}
                onClick={() => readyToPlay(room)}
              >
                <FiSmile />
                <span className="ml-4">{t('admin:field-submit')}</span>
              </Button>
            </div>
          </Fragment>
          {message.visible && (
            <div className="mt-8">
              <Message type={message.type}>{message.content}</Message>
            </div>
          )}
        </Box>
      </Container>
    </Layout>
  )
}
