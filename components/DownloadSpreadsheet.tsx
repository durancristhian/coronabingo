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

  const downloadSpreadsheet = async () => {
    if (isExporting.current || exportState !== 'ready') return

    isExporting.current = true
    setExportState('exporting')

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

    try {
      const zipcelx = await loadZipcelx()
      /* The cell type is widened while building the legacy config. */
      // @ts-ignore
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
            disabled={!players.length || exportState !== 'ready'}
            iconLeft={<FiDownload />}
          >
            {buttonLabel}
          </Button>
        )}
      </div>
    </Fragment>
  )
}
