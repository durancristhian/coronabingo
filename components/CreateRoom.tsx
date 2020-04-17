import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import { FiSmile } from 'react-icons/fi'
import Heading from '~/components/Heading'
import { MessageType } from '~/interfaces'
import roomApi from '~/models/room'
import isObjectFulfilled from '~/utils/isObjectFulfilled'
import Button from './Button'
import InputText from './InputText'
import Message from './Message'

export default function CreateRoom() {
  const { t } = useTranslation()
  const [canSubmit, setCanSubmit] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
  })
  const [messageProps, setMessageProps] = useState<{
    message: string
    type: MessageType
  }>({
    message: '',
    type: 'information',
  })

  useEffect(() => {
    setCanSubmit(isObjectFulfilled(formData))
  }, [formData.name])

  const onFieldChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value,
    })
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setMessageProps({
      message: t('index:create-room.saving'),
      type: 'information',
    })

    try {
      const roomId = await roomApi.createRoom({
        name: formData.name,
      })

      setMessageProps({
        message: t('index:create-room.success'),
        type: 'success',
      })

      setTimeout(() => {
        Router.pushI18n('/room/[roomId]/admin', `/room/${roomId}/admin`)
      }, 1000)
    } catch (error) {
      setMessageProps({
        message: t('index:create-room.error'),
        type: 'error',
      })
    }
  }

  return (
    <Fragment>
      <Heading type="h2">
        <span className="uppercase">{t('index:create-room.title')}</span>
      </Heading>
      <form onSubmit={onSubmit}>
        <InputText
          id="name"
          label={t('index:create-room.field-name')}
          onChange={value => onFieldChange('name', value)}
          value={formData.name}
        />
        <div className="mt-8">
          <Button className="w-full" disabled={!canSubmit} type="submit">
            <FiSmile />
            <span className="ml-4">{t('index:create-room.field-submit')}</span>
          </Button>
        </div>
      </form>
      {messageProps.message && (
        <div className="mt-8">
          <Message type={messageProps.type}>{messageProps.message}</Message>
        </div>
      )}
    </Fragment>
  )
}
