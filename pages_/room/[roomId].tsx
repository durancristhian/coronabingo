import classnames from 'classnames'
import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import { FiLink2, FiSmile } from 'react-icons/fi'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Container from '~/components/Container'
import Copy from '~/components/Copy'
import DownloadSpreadsheet from '~/components/DownloadSpreadsheet'
import Heading from '~/components/Heading'
import InputText from '~/components/InputText'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import RoomCode from '~/components/RoomCode'
import useEasterEgg from '~/hooks/useEasterEgg'
import useRoom from '~/hooks/useRoom'
import useRoomPlayers from '~/hooks/useRoomPlayers'
import { Player } from '~/interfaces'
import { getBaseUrl, isRoomOld, scrollToTop } from '~/utils'
import useRoomCode from '~/hooks/useRoomCode'

export default function Sala() {
  const { room } = useRoom()
  const { players } = useRoomPlayers()
  const { t } = useTranslation()
  const { isActive, incrementInteractions } = useEasterEgg(
    'downloadSpreadsheet',
  )
  const [name, setName] = useState('')
  const [inProgress, setInProgress] = useState(false)
  const { loggedIn } = useRoomCode()

  useEffect(scrollToTop, [])

  if (!room) {
    return (
      <Layout>
        <Container>
          <Message type="information">{t('roomId:loading')}</Message>
        </Container>
      </Layout>
    )
  }

  if (isRoomOld(room)) {
    return (
      <Layout>
        <Container>
          <Message type="error">{t('common:outdated-room')}</Message>
        </Container>
      </Layout>
    )
  }

  const renderPlayers = () => {
    /* TODO: esto no va a pasar más, siempre al menos habrá un player, el admin */
    if (!players.length) {
      return <Message type="information">{t('roomId:not-ready')}</Message>
    }

    return (
      <Fragment>
        <Heading type="h3" textCenter={false}>
          {t('roomId:people', { count: players.length })}
        </Heading>
        <p className="italic mt-2 text-gray-800 text-xs md:text-sm">
          {t('roomId:list-description')}
        </p>
        <div className="border-gray-300 border-t-2 mt-4 -mx-4">
          {players.map((player: Player, index: number) => (
            <div
              key={index}
              className={classnames([
                'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
                player.id === room.adminId
                  ? 'bg-green-100'
                  : index % 2 === 0
                  ? 'bg-gray-100'
                  : 'bg-gray-200',
              ])}
            >
              <div className="flex flex-auto flex-wrap items-center">
                <p>{player.name}</p>
                {player.id === room.adminId && (
                  <span className="bg-green-200 border-2 border-green-300 font-medium ml-4 px-2 py-1 rounded text-xs">
                    {t('roomId:is-admin')}
                  </span>
                )}
                <p className="italic mt-2 text-gray-800 text-sm w-full">
                  {t('common:ticket_plural', {
                    ticketId: player.tickets.split(',').join(' & '),
                  })}
                </p>
              </div>
              <div className="ml-4">
                <Button
                  aria-label={t('roomId:play')}
                  color="green"
                  id={`play${index + 1}`}
                  onClick={() => {
                    if (!room.id || !player.id) return

                    Router.pushI18n(
                      `/room/[roomId]/[playerId]`,
                      `/room/${room.id}/${player.id}`,
                    )
                  }}
                >
                  <FiLink2 />
                  <span className="ml-4">{t('roomId:play')}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    )
  }

  const renderContent = () => {
    return (
      <Fragment>
        <div className="mb-4">
          <Heading type="h2">
            <span
              id="room-title"
              onClick={incrementInteractions}
              role="button"
              tabIndex={0}
              onKeyPress={incrementInteractions}
              className="cursor-text focus:outline-none outline-none"
            >
              {t('roomId:title')}
            </span>
          </Heading>
        </div>
        <InputText
          id="room-name"
          label={t('roomId:room-name')}
          value={room.name}
          readonly
          onFocus={event => event.target.select()}
        />
        <InputText
          id="url"
          label={t('roomId:field-link')}
          value={`${getBaseUrl()}/room/${room.id}`}
          readonly
          onFocus={event => event.target.select()}
        />
        <Copy content={`${getBaseUrl()}/room/${room.id}`} />
        {isActive && (
          <div className="mt-8">
            <DownloadSpreadsheet players={players} room={room} />
          </div>
        )}
        <div className="mt-8">{renderPlayers()}</div>
      </Fragment>
    )
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
  }

  const renderAdmin = () => {
    return <h1>Admin</h1>
  }

  console.log(room.code)

  if (loggedIn) {
    return (
      <Layout>
        <Container size="large">
          <Box>{renderAdmin()}</Box>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container size="large">
        <div className="lg:flex">
          <div className="lg:w-1/2">
            <div className="lg:pr-2">
              <Box>
                <div className="mb-4">
                  <Heading type="h2">Ingreso admin</Heading>
                </div>
                <RoomCode roomCode={room.code} />
              </Box>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="lg:pl-2">
              <Box>
                <div className="mb-4">
                  <Heading type="h2">Ingreso de participantes</Heading>
                </div>
                <form onSubmit={onSubmit}>
                  <InputText
                    id="player-name"
                    label="Tu nombre"
                    onChange={setName}
                    value={name}
                    disabled={inProgress}
                  />
                  <div className="mt-8">
                    <Button
                      aria-label="Unirme"
                      className="w-full"
                      color="green"
                      disabled={!name || inProgress}
                      type="submit"
                      id="join-room"
                    >
                      <FiSmile />
                      <span className="ml-4">Unirme</span>
                    </Button>
                  </div>
                </form>
              </Box>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}
