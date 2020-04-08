import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import { FiSmile } from 'react-icons/fi'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Checkbox from '~/components/Checkbox'
import InputText from '~/components/InputText'
import Layout from '~/components/Layout'
import Message, { MessageType } from '~/components/Message'
import Players from '~/components/Players'
import useRandomBoards from '~/hooks/useRandomBoards'
import useRoomPlayers from '~/hooks/useRoomPlayers'
import Field from '~/interfaces/Field'
import db, { roomsRef } from '~/utils/firebase'
import * as gtag from '~/utils/gtag'

export default function Admin() {
  const { t } = useTranslation()
  const router = useRouter()
  const roomId = router.query.roomId?.toString()
  const [room, setRoom] = useState<{
    data: firebase.firestore.DocumentData | undefined
    error: string | null
    loading: boolean
  }>({
    data: undefined,
    error: null,
    loading: false,
  })
  const [message, setMessage] = useState<{
    content: string
    type: MessageType
  }>({
    content: '',
    type: 'information',
  })
  const [players, setPlayers] = useRoomPlayers(roomId)
  const randomBoards = useRandomBoards()

  useEffect(() => {
    const getRoomData = async () => {
      setRoom({
        data: undefined,
        error: null,
        loading: true,
      })

      try {
        const roomDoc = roomsRef.doc(roomId)
        const roomData = await roomDoc.get()

        if (!roomData.exists) {
          Router.pushI18n('/')

          return
        }

        setRoom({
          loading: false,
          error: null,
          data: roomData.data(),
        })
      } catch (error) {
        setRoom({
          loading: false,
          error,
          data: undefined,
        })
      }
    }

    if (roomId) getRoomData()
  }, [roomId])

  const onFieldChange = (changes: { key: string; value: Field }[]) => {
    setRoom({
      ...room,
      data: Object.assign(
        {},
        room.data,
        ...[...changes.map(({ key, value }) => ({ [key]: value }))],
      ),
    })
  }

  const removePlayer = (playerId: string) => {
    roomsRef
      .doc(roomId)
      .collection('players')
      .doc(playerId)
      .delete()
  }

  const readyToPlay = async () => {
    setMessage({
      content: t('admin:success'),
      type: 'success',
    })

    const roomDoc = roomsRef.doc(roomId)

    const batch = db.batch()
    batch.update(roomDoc, {
      ...room.data,
      selectedNumbers: [],
      showConfetti: false,
      readyToPlay: true,
    })

    players.map((player, index) => {
      const { id, name } = player

      batch.set(roomDoc.collection('players').doc(id), {
        name,
        boards: randomBoards[index],
        selectedNumbers: [],
      })
    })

    await batch.commit()

    gtag.event('create', 'room', 'players', players.length.toString())

    setTimeout(() => {
      Router.pushI18n('/room/[roomId]', `/room/${roomId}`)
    }, 1000)
  }

  return (
    <Layout>
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="md:w-2/4 mx-auto">
            <Box>
              <h2 className="font-medium text-center text-lg md:text-xl">
                {t('admin:title')}
              </h2>
              {room.error && <Message type="error">{t('admin:error')}</Message>}
              {room.loading && (
                <Message type="information">{t('admin:loading')}</Message>
              )}
              {room.data && (
                <Fragment>
                  <InputText
                    id="room-name"
                    label={t('admin:field-name')}
                    value={room.data.name}
                    readonly
                    onFocus={event => event.target.select()}
                  />
                  <InputText
                    hint={t('admin:field-link-hint')}
                    id="url"
                    label={t('admin:field-link')}
                    value={`${window.location.host}/room/${roomId}`}
                    readonly
                    onFocus={event => event.target.select()}
                  />
                  <InputText
                    id="videoCall"
                    label={t('admin:field-videocall')}
                    onChange={value =>
                      onFieldChange([{ key: 'videoCall', value }])
                    }
                    value={room.data.videoCall || ''}
                  />
                  <Players
                    players={players}
                    setPlayers={setPlayers}
                    adminId={room.data.adminId}
                    onChange={onFieldChange}
                    removePlayer={removePlayer}
                    roomId={roomId}
                  />
                  <div className="mt-4">
                    <Checkbox
                      hint={t('admin:field-turningGlob-hint')}
                      id="turningGlob"
                      label={t('admin:field-turningGlob')}
                      onChange={value =>
                        onFieldChange([{ key: 'turningGlob', value }])
                      }
                      value={room.data.turningGlob || false}
                    />
                  </div>
                  <div className="mt-8">
                    <Button
                      id="readyToPlay"
                      className="w-full"
                      disabled={!room.data.adminId}
                      onClick={readyToPlay}
                    >
                      <FiSmile />
                      <span className="ml-4">{t('admin:field-submit')}</span>
                    </Button>
                  </div>
                </Fragment>
              )}
              {message.content && (
                <Message type={message.type}>{message.content}</Message>
              )}
            </Box>
          </div>
        </div>
      </div>
    </Layout>
  )
}
