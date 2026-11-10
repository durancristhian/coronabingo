import { ZipCelXConfig, ZipCelXRow } from 'zipcelx'
import useTranslation from 'next-translate/useTranslation'
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { FiDownload, FiRefreshCw } from 'react-icons/fi'
import Button from '~/components/Button'
import Heading from '~/components/Heading'
import Message from '~/components/Message'
import { Player } from '~/interfaces/models/Player'
import { Room } from '~/interfaces/models/Room'
import { getBaseUrl } from '~/utils/getBaseUrl'

interface Props {
  players: Player[]
  room: Room
}

type ExportState = 'loading' | 'ready' | 'exporting' | 'error'
type Zipcelx = typeof import('zipcelx')['default']

let zipcelxPromise: Promise<Zipcelx> | null = null

function loadZipcelx() {
  if (!zipcelxPromise) {
    zipcelxPromise = import('zipcelx')
      .then(module => module.default)
      .catch(error => {
        zipcelxPromise = null
        throw error
      })
  }

  return zipcelxPromise
}

export default function DownloadSpreadsheet({ players, room }: Props) {
  const { t } = useTranslation()
  const [exportState, setExportState] = useState<ExportState>('loading')
  const isMounted = useRef(false)
  const isExporting = useRef(false)

  const prepareSpreadsheet = useCallback(async () => {
    setExportState('loading')

    try {
      await loadZipcelx()
      if (isMounted.current) setExportState('ready')
    } catch {
      if (isMounted.current) setExportState('error')
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    void prepareSpreadsheet()

    return () => {
      isMounted.current = false
    }
  }, [prepareSpreadsheet])

  const host = players.find(player => player.id === room.adminId)

  const downloadSpreadsheet = async () => {
    if (isExporting.current || exportState !== 'ready' || !host) return

    isExporting.current = true
    setExportState('exporting')

    try {
      const withoutAdmin = players.filter(player => player.id !== host.id)
      const admin = host

      const roomName: ZipCelXRow = [
        { value: t('roomId:spreadsheet-room'), type: 'string' },
        { value: room.name, type: 'string' },
      ]
      const roomLink: ZipCelXRow = [
        { value: t('roomId:spreadsheet-link'), type: 'string' },
        {
          value: `${getBaseUrl()}/room/${room.id}`,
          type: 'string',
        },
      ]
      const roomCapacity: ZipCelXRow = [
        { value: t('roomId:spreadsheet-capacity'), type: 'string' },
        { value: players.length, type: 'number' },
      ]
      const roomAdmin: ZipCelXRow = [
        { value: t('roomId:spreadsheet-admin'), type: 'string' },
        { value: admin.name, type: 'string' },
        { value: admin.tickets, type: 'string' },
        {
          value: `${getBaseUrl()}/room/${room.id}/${admin.id}`,
          type: 'string',
        },
      ]
      const emptyLine: ZipCelXRow = [{ value: '', type: 'string' }]
      const roomPlayers = withoutAdmin.map<ZipCelXRow>(p => [
        { value: p.name, type: 'string' },
        { value: p.tickets, type: 'string' },
        {
          value: `${getBaseUrl()}/room/${room.id}/${p.id}`,
          type: 'string',
        },
      ])

      const config: ZipCelXConfig = {
        filename: room.name,
        sheet: {
          data: [
            roomName,
            roomLink,
            roomCapacity,
            roomAdmin,
            emptyLine,
            ...roomPlayers,
          ],
        },
      }

      const zipcelx = await loadZipcelx()
      await zipcelx(config)
      if (isMounted.current) setExportState('ready')
    } catch {
      if (isMounted.current) setExportState('error')
    } finally {
      isExporting.current = false
    }
  }

  const buttonLabel =
    exportState === 'loading'
      ? t('roomId:spreadsheet-loading')
      : exportState === 'exporting'
      ? t('roomId:spreadsheet-generating')
      : t('roomId:download-spreadsheet', { name: room.name })

  return (
    <Fragment>
      <Heading type="h3">{t('roomId:spreadsheet-title')}</Heading>
      <p className="italic mt-2 text-gray-800 text-xs md:text-sm">
        {t('roomId:spreadsheet-description')}
      </p>
      <div aria-live="polite" className="mt-4">
        {!host && (
          <Message type="error">{t('roomId:spreadsheet-missing-host')}</Message>
        )}
        {exportState === 'error' ? (
          <Fragment>
            <Message type="error">{t('roomId:spreadsheet-load-error')}</Message>
            <div className="mt-4">
              <Button
                aria-label={t('roomId:spreadsheet-retry')}
                id="retry-spreadsheet"
                onClick={prepareSpreadsheet}
                iconLeft={<FiRefreshCw />}
              >
                {t('roomId:spreadsheet-retry')}
              </Button>
            </div>
          </Fragment>
        ) : (
          <Button
            aria-label={buttonLabel}
            id="download-spreadsheet"
            onClick={downloadSpreadsheet}
            color="green"
            disabled={!host || exportState !== 'ready'}
            iconLeft={<FiDownload />}
          >
            {buttonLabel}
          </Button>
        )}
      </div>
    </Fragment>
  )
}
