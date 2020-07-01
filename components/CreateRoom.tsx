import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React, { FormEvent, Fragment, useState } from 'react'
import { FiSmile } from 'react-icons/fi'
import Button from '~/components/Button'
import Heading from '~/components/Heading'
import InputText from '~/components/InputText'
import { useAnalytics } from '~/hooks/useAnalytics'
import useToast from '~/hooks/useToast'
import roomApi from '~/models/room'
import { generateRoomCode } from '~/utils'

export default function CreateRoom() {
  const log = useAnalytics()
  const { t } = useTranslation()
  const { createToast, dismissToast, updateToast } = useToast()
  const [name, setName] = useState('')
  const [inProgress, setInProgress] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setInProgress(true)

    const toastId = createToast('index:create-room.saving', 'information')

    try {
      const roomId = await roomApi.createRoom({
        code: generateRoomCode(),
        name,
      })

      updateToast('index:create-room.success', 'success', toastId)

      log('room_created', {
        description: name,
      })

      setTimeout(() => {
        dismissToast(toastId)
      }, 2000)

      Router.pushI18n('/room/[roomId]/admin', `/room/${roomId}/admin`)
    } catch (e) {
      updateToast('index:create-room.error', 'error', toastId)

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
            iconLeft={<FiSmile />}
          >
            {t('index:create-room.field-submit')}
          </Button>
        </div>
      </form>
    </Fragment>
  )
}
