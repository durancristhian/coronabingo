import Router from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import React, { FormEvent, Fragment, useRef, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import Button from '~/components/Button'
import Heading from '~/components/Heading'
import InputText from '~/components/InputText'
import useToast from '~/hooks/useToast'
import { getRoomCreatedEventParams } from '~/utils/analyticsEvents'
import { generateRoomCode } from '~/utils/generateRoomCode'
import { logEvent as log } from '~/utils/gtag'

type RoomApi = typeof import('~/models/room')['default']
let roomApiPromise: Promise<RoomApi> | null = null

function loadRoomApi() {
  if (!roomApiPromise) {
    roomApiPromise = import('~/models/room')
      .then(module => module.default)
      .catch(error => {
        roomApiPromise = null
        throw error
      })
  }
  return roomApiPromise
}

export default function CreateRoom() {
  const { lang, t } = useTranslation()
  const { createToast, dismissToast, updateToast } = useToast()
  const [name, setName] = useState('')
  const [inProgress, setInProgress] = useState(false)
  const submitting = useRef(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!name || submitting.current) return
    submitting.current = true
    setInProgress(true)

    const toastId = createToast('index:create-room.saving', 'information')
    try {
      const roomApi = await loadRoomApi()
      const { createdAt, roomId } = await roomApi.createRoom({
        code: generateRoomCode(),
        name,
      })

      updateToast('index:create-room.success', 'success', toastId)

      log('room_created', getRoomCreatedEventParams(lang, createdAt))

      setTimeout(() => {
        dismissToast(toastId)
      }, 2000)

      Router.push('/room/[roomId]/admin', `/room/${roomId}/admin`)
    } catch (e) {
      updateToast('index:create-room.error', 'error', toastId)

      submitting.current = false
      setInProgress(false)
    }
  }

  return (
    <Fragment>
      <div className="mb-4">
        <Heading textAlign="center" type="h2">
          {t('index:create-room.title')}
        </Heading>
      </div>
      <form onSubmit={onSubmit}>
        <InputText
          id="name"
          label={t('index:create-room.field-name')}
          onChange={setName}
          onFocus={() => {
            // Preload on intent; submission reports failures and can retry.
            void loadRoomApi().catch(() => undefined)
          }}
          value={name}
          disabled={inProgress}
        />
        <div className="mt-8">
          <Button
            aria-label={t('index:create-room.field-submit')}
            className="w-full"
            color="green"
            disabled={!name || inProgress}
            type="submit"
            id="create-room"
            iconLeft={<FiPlus />}
          >
            {t('index:create-room.field-submit')}
          </Button>
        </div>
      </form>
    </Fragment>
  )
}
