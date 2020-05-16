import classnames from 'classnames'
import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useEffect } from 'react'
import { FiLink2 } from 'react-icons/fi'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Container from '~/components/Container'
import Copy from '~/components/Copy'
import DownloadSpreadsheet from '~/components/DownloadSpreadsheet'
import Heading from '~/components/Heading'
import InputText from '~/components/InputText'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import useEasterEgg from '~/hooks/useEasterEgg'
import useRoom from '~/hooks/useRoom'
import useRoomPlayers from '~/hooks/useRoomPlayers'
import { Player } from '~/interfaces'
import { getBaseUrl, scrollToTop } from '~/utils'

export default function Sala() {
  const { room } = useRoom()
  const { players } = useRoomPlayers()
  const { t } = useTranslation()
  const { isActive, incrementInteractions } = useEasterEgg(
    'downloadSpreadsheet',
  )

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

  const renderPlayers = () => {
    if (!room.readyToPlay || !players.length) {
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
                  id="play"
                  disabled={!room.readyToPlay}
                  onClick={() => {
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

  return (
    <Layout>
      <Container>
        <Box>
          <div className="mb-4">
            <Heading type="h2">
              <span
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
            hint={t('roomId:field-link-hint')}
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
        </Box>
      </Container>
    </Layout>
  )
}
