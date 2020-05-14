import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { FiDownload } from 'react-icons/fi'
import zipcelx from 'zipcelx'
import { Player, Room } from '~/interfaces'
import Button from './Button'

interface Props {
  players: Player[]
  room: Room
}

export default function DownloadSpreadsheet({ players, room }: Props) {
  const { lang } = useTranslation()

  const downloadSpreadsheet = () => {
    const config = {
      /* TODO: translate name */
      filename: 'coronabingo-players-list',
      sheet: {
        data: players.map(p => [
          {
            value: p.name,
            type: 'string',
          },
          {
            value: p.tickets,
            type: 'string',
          },
          {
            value: `${window.location.protocol}//${window.location.host}/${lang}/room/${room.id}/${p.id}`,
            type: 'string',
          },
        ]),
      },
    }

    /* Types are wrong */
    // @ts-ignore
    zipcelx(config)
  }

  return (
    <Button
      aria-label="Descargar planilla"
      id="download-spreadsheet"
      onClick={downloadSpreadsheet}
      color="green"
      disabled={!players.length}
    >
      <FiDownload />
      <span className="ml-4">Descargar planilla</span>
    </Button>
  )
}
