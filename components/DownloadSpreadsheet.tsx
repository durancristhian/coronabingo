import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import { FiDownload } from 'react-icons/fi'
import zipcelx from 'zipcelx'
import Button from '~/components/Button'
import Heading from '~/components/Heading'
import { Player, Room } from '~/interfaces'
import { getBaseUrl } from '~/utils'

interface Props {
  players: Player[]
  room: Room
}

export default function DownloadSpreadsheet({ players, room }: Props) {
  const { t } = useTranslation()

  const downloadSpreadsheet = () => {
    const withoutAdmin = [...players]
    const adminId = withoutAdmin.findIndex(p => p.id === room.adminId)
    const [admin] = withoutAdmin.splice(adminId, 1)

    const roomName = [
      { value: t('roomId:spreadsheet-room'), type: 'string' },
      { value: room.name, type: 'string' },
    ]
    const roomLink = [
      { value: t('roomId:spreadsheet-link'), type: 'string' },
      {
        value: `${getBaseUrl()}/room/${room.id}`,
        type: 'string',
      },
    ]
    const roomCapacity = [
      { value: t('roomId:spreadsheet-capacity'), type: 'string' },
      { value: players.length, type: 'number' },
    ]
    const roomAdmin = [
      { value: t('roomId:spreadsheet-admin'), type: 'string' },
      { value: admin.name, type: 'string' },
      { value: admin.tickets, type: 'string' },
      {
        value: `${getBaseUrl()}/room/${room.id}/${admin.id}`,
        type: 'string',
      },
    ]
    const emptyLine = [{ value: '', type: 'string' }]
    const roomPlayers = withoutAdmin.map(p => [
      { value: p.name, type: 'string' },
      { value: p.tickets, type: 'string' },
      {
        value: `${getBaseUrl()}/room/${room.id}/${p.id}`,
        type: 'string',
      },
    ])

    const config = {
      filename: room.name,
      sheet: {
        data: [
          roomName,
          roomLink,
          roomCapacity,
          roomAdmin,
          emptyLine,
          ...roomPlayers,
        ].filter(Boolean),
      },
    }

    /* Types are wrong */
    // @ts-ignore
    zipcelx(config)
  }

  return (
    <Fragment>
      <Heading type="h3">{t('roomId:spreadsheet-title')}</Heading>
      <p className="italic mt-2 text-gray-800 text-xs md:text-sm">
        {t('roomId:spreadsheet-description')}
      </p>
      <div className="mt-4">
        <Button
          aria-label={t('roomId:download-spreadsheet', { name: room.name })}
          id="download-spreadsheet"
          onClick={downloadSpreadsheet}
          color="green"
          disabled={!players.length}
          iconLeft={<FiDownload />}
        >
          {t('roomId:download-spreadsheet', { name: room.name })}
        </Button>
      </div>
    </Fragment>
  )
}
