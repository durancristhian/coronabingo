import classnames from 'classnames'
import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { FiLink2 } from 'react-icons/fi'
import Button from '~/components/Button'
import InputText from '~/components/InputText'
import Layout from '~/components/Layout'
import { IPlayer } from '~/components/Players'
import useRoom from '~/hooks/useRoom'
import useRoomPlayers from '~/hooks/useRoomPlayers'

export default function Sala() {
  const router = useRouter()
  const roomId = router.query.id?.toString()
  const room = useRoom(roomId)
  const [players] = useRoomPlayers(roomId)
  const { t } = useTranslation()

  return (
    <Layout>
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white md:w-2/4 mx-auto px-4 py-8 rounded shadow">
            <div className="mb-8">
              <h2 className="font-medium text-center text-lg md:text-xl">
                {t('sala:title')}
              </h2>
            </div>
            <div className="mb-8">
              <img
                src={require('~/public/virus/happy.png')}
                alt="coronavirus feliz"
                className="h-32 mx-auto"
              />
            </div>
            {room.name && (
              <InputText
                id="room-name"
                label={t('sala:room-name')}
                value={roomId || ''}
                readonly
                onFocus={event => event.target.select()}
              />
            )}
            {room.videoCall && (
              <InputText
                id="videocall"
                label={t('sala:call-link')}
                readonly
                onFocus={event => event.target.select()}
                value={room.videoCall || ''}
              />
            )}
            {!room.readyToPlay && (
              <div className="mt-8">
                <div className="italic text-gray-600 text-xs md:text-sm">
                  {t('sala:not-ready')}
                </div>
              </div>
            )}
            {room.readyToPlay && (
              <div className="mt-8">
                <h3 className="font-medium">
                  {t('sala:people', { count: players.length })}
                </h3>
                <div className="italic -mt-6 text-gray-600 text-xs md:text-sm">
                  <p className="my-8">{t('sala:list-description')}</p>
                </div>
                <div className="border-gray-300 border-t-2 mt-4 -mx-4">
                  {players.map((player: IPlayer, index: number) => (
                    <div
                      key={index}
                      className={classnames([
                        'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
                        player.id === room.adminId
                          ? 'bg-green-100'
                          : index % 2 === 0
                          ? 'bg-gray-100'
                          : 'bg-gray-200'
                      ])}
                    >
                      <div className="flex flex-auto flex-wrap items-center">
                        <p>{player.name}</p>
                        {player.id === room.adminId && (
                          <span className="bg-green-200 border-2 border-green-300 font-medium ml-4 px-2 py-1 rounded text-xs">
                            {t('sala:is-admin')}
                          </span>
                        )}
                        <p className="italic mt-2 text-gray-600 text-sm w-full">
                          {t('common:board_plural', {
                            boardId: player.boards.split(',').join(' & ')
                          })}
                        </p>
                      </div>
                      <div className="ml-4">
                        <Button
                          id="play"
                          disabled={!room.readyToPlay}
                          onClick={() =>
                            Router.pushI18n(
                              `/sala/[id]/jugar?jugador=${player.id}`,
                              `/sala/${roomId}/jugar?jugador=${player.id}`
                            )
                          }
                        >
                          <FiLink2 />
                          <span className="ml-4">{t('sala:play')}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
